import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BLEConnectionManager, ConnectionState } from '../lib/BLEConnectionManager';
import {type DeviceInfo, parseDeviceName} from '../lib/DeviceUtils';
import { VenusPacket } from '../lib/VenusPacket';
import {VenusRegistry} from "../lib/payloads/VenusPayloads.ts";
import type {VenusData, VenusPayloadStatic} from "../lib/payloads/VenusPayloads.ts";

interface BLEContextType {
    manager: BLEConnectionManager;
    connectionState: ConnectionState;
    deviceInfo: DeviceInfo | null;
    rssi: number | null;
    error: string | null;
    
    connect: () => void;
    reconnect: () => void;
    disconnect: () => void;
    sendPacket: (cmd: number, payload?: Uint8Array) => Promise<void>;
}

const BLEContext = createContext<BLEContextType | null>(null);

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
    // Lazy initialization ensures we don't create new Manager instances on every render
    const managerRef = useRef<BLEConnectionManager | null>(null);
    if (!managerRef.current) {
        managerRef.current = new BLEConnectionManager();
    }

    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.IDLE);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [rssi, setRssi] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const mgr = managerRef.current!;
        
        mgr.onStateChange = (state, msg) => {
            setConnectionState(state);

            if (state === ConnectionState.ERROR && msg) {
                setError(msg);
            }
            
            if (state === ConnectionState.CONNECTED && mgr.device) {
                setDeviceInfo(parseDeviceName(mgr.device.name || "Unknown"));
            }
        };

        mgr.onRSSI = (val) => setRssi(val);
        
        return () => mgr.disconnect();
    }, []);

    // Actions
    const connect = () => {
        setError(null);
        managerRef.current!.scanAndConnect();
    };

    const reconnect = () => {
        setError(null);
        managerRef.current!.reconnect();
    };

    const disconnect = () => {
        managerRef.current!.disconnect();
    };

    const sendPacket = (cmd: number, p?: Uint8Array) => {
        return managerRef.current!.sendPacket(cmd, p);
    };

    return (
        <BLEContext.Provider value={{
            manager: managerRef.current!,
            connectionState,
            deviceInfo,
            rssi,
            error,
            connect,
            reconnect,
            disconnect,
            sendPacket
        }}>
            {children}
        </BLEContext.Provider>
    );
};

export const useBLE = () => {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error("useBLE must be used within BLEProvider");
    }
    return context;
};

export function useVenusData<ID extends keyof typeof VenusRegistry>(
    commandId: ID,
): VenusData<ID> | null {
    const { manager } = useBLE();
    const [data, setData] = useState<VenusData<ID> | null>(null);

    useEffect(() => {
        const handler = (packet: VenusPacket) => {
            if (packet.commandId === commandId) {
                const PayloadClass = VenusRegistry[commandId] as unknown as VenusPayloadStatic<VenusData<ID>>;

                // Parse and update state
                const parsed = PayloadClass.FROM_BYTES(packet.payload);
                setData(parsed);
            }
        };

        manager.subscribe(commandId, handler);
        return () => manager.unsubscribe(commandId, handler);
    }, [manager, commandId]);

    return data;
}
