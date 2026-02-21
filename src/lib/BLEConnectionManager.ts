/// <reference types="web-bluetooth" />

import { VenusPacket } from "./VenusPacket";

export const SERVICE_UUID = '0000ff00-0000-1000-8000-00805f9b34fb';
export const TX_UUID = '0000ff01-0000-1000-8000-00805f9b34fb';
export const RX_UUID = '0000ff02-0000-1000-8000-00805f9b34fb';

export const ConnectionState = Object.freeze({
    IDLE: "IDLE",
    SCANNING: "SCANNING",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    DISCONNECTED: "DISCONNECTED",
    ERROR: "ERROR"
});
export type ConnectionState = (typeof ConnectionState)[keyof typeof ConnectionState];

type PacketListener = (packet: VenusPacket) => void;

export class BLEConnectionManager {
    public device: BluetoothDevice | null = null;
    
    private txChar: BluetoothRemoteGATTCharacteristic | null = null; 
    private rxChar: BluetoothRemoteGATTCharacteristic | null = null;
    
    public onStateChange: (state: ConnectionState, msg?: string) => void = () => {};
    public onRSSI: (rssi: number) => void = () => {};
    
    private listeners: Map<number, PacketListener[]> = new Map();

    constructor() {}

    public subscribe(commandId: number, callback: PacketListener) {
        if (!this.listeners.has(commandId)) {
            this.listeners.set(commandId, []);
        }
        this.listeners.get(commandId)?.push(callback);
    }

    public unsubscribe(commandId: number, callback: PacketListener) {
        const listeners = this.listeners.get(commandId);
        if (listeners) {
            this.listeners.set(commandId, listeners.filter(cb => cb !== callback));
        }
    }

    private dispatchPacket(packet: VenusPacket) {
        const handlers = this.listeners.get(packet.commandId);
        if (handlers) {
            handlers.forEach(fn => fn(packet));
        }
    }

    private log(msg: string, data?: any) {
        console.log(`[BLEConnectionManager] ${msg}`, data || '');
    }

    private error(msg: string, err?: any) {
        console.error(`[BLEConnectionManager] ${msg}`, err || '');
    }

    async scanAndConnect() {
        if (!navigator.bluetooth) {
            this.error("Web Bluetooth not supported");
            return;
        }

        this.onStateChange(ConnectionState.SCANNING);
        this.log("Starting Scan...");

        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'MST_' }],
                optionalServices: [SERVICE_UUID]
            });

            this.log("Device selected:", this.device.name);

            this.device.addEventListener('gattserverdisconnected', this.handleDisconnect);

            if (this.device.watchAdvertisements) {
                this.log("Starting RSSI watch...");
                this.device.addEventListener('advertisementreceived', (event) => {
                    this.onRSSI(event.rssi ?? -100);
                });
                await this.device.watchAdvertisements();
            }

            await this.connectGATT();
        } catch (err: any) {
            if (err.name === 'NotFoundError') {
                this.log("User cancelled scan");
                this.onStateChange(ConnectionState.IDLE);
            } else {
                this.error("Scan Error", err);
                this.onStateChange(ConnectionState.ERROR, err.message);
            }
        }
    }

    async reconnect() {
        if (!this.device) {
            this.error("Cannot reconnect: No device instance.");
            return;
        }
        this.log("Attempting Reconnect...");
        try {
            await this.connectGATT();
        } catch (err: any) {
            this.error("Reconnect Failed", err);
            this.onStateChange(ConnectionState.ERROR, "Reconnection failed: " + err.message);
        }
    }

    disconnect() {
        this.log("Disconnecting...");
        if (this.device && this.device.gatt?.connected) {
            this.device.gatt.disconnect();
        } else {
            this.handleDisconnect();
        }
    }

    private async connectGATT() {
        if (!this.device) return;

        this.onStateChange(ConnectionState.CONNECTING);
        this.log("Connecting to GATT Server...");

        try {
            const server = await this.device.gatt?.connect();
            if (!server || !server.connected) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error("GATT Server connection failed immediately.");
            }
            this.log("GATT Connected");

            this.log(`Getting Service ${SERVICE_UUID}...`);
            const service = await server.getPrimaryService(SERVICE_UUID);
            
            this.log(`Getting TX Characteristic ${TX_UUID}...`);
            this.txChar = await service.getCharacteristic(TX_UUID);
            
            this.log(`Getting RX Characteristic ${RX_UUID}...`);
            this.rxChar = await service.getCharacteristic(RX_UUID);
            
            this.log("Starting Notifications on RX...");
            await this.rxChar.startNotifications();
            this.rxChar.addEventListener('characteristicvaluechanged', (e: any) => {
                try {
                    const p = VenusPacket.fromBytes(e.target.value);
                    this.log(`RX: Cmd 0x${p.commandId.toString(16)}`, p.toBytes());
                    this.dispatchPacket(p);
                } catch (err) {
                    console.warn("Parse Error:", err);
                }
            });

            this.log("Connection Fully Established.");
            this.onStateChange(ConnectionState.CONNECTED);

        } catch (err: any) {
            this.error("Connection Sequence Failed", err);
            if (this.device?.gatt?.connected) {
                this.device.gatt.disconnect();
            }
            throw err;
        }
    }

    async sendPacket(cmd: number, payload?: Uint8Array) {
        if (!this.txChar || !this.device?.gatt?.connected) {
            this.error("Cannot send: Not connected");
            throw new Error("Not connected");
        }

        const p = new VenusPacket(cmd, payload);
        const raw = p.toBytes();

        this.log(`TX: Cmd 0x${cmd.toString(16)}`, raw);

        try {
            await this.txChar.writeValue(raw as BufferSource);
        } catch (err) {
            this.error("Write Failed", err);
            throw err;
        }
    }

    private handleDisconnect = () => {
        this.log("Device Disconnected Event fired");
        this.txChar = null;
        this.rxChar = null;
        this.onStateChange(ConnectionState.DISCONNECTED);
    };
}
