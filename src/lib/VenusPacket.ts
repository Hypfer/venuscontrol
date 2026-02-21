export const CommandId = Object.freeze({
    STATE: 0x03,
    DEVICE_INFO: 0x04,
    FACTORY_RESET: 0x06,
    
    BACKUP_POWER_CONTROL: 0x0F,

    SURPLUS_FEED_IN_CONTROL: 0x41,
    
    DEPTH_OF_DISCHARGE_CONTROL: 0x54,
    
    LED_CONTROL: 0x59
})

export type CommandId = (typeof CommandId)[keyof typeof CommandId];

export class VenusPacket {
    static readonly MAGIC = 0x73;

    public commandId: number;
    public payload: Uint8Array;

    constructor(commandId: number, payload: Uint8Array = new Uint8Array(0)) {
        this.commandId = commandId;
        this.payload = payload;
    }
    
    toBytes(): Uint8Array {
        const totalLength = 1 + 1 + 1 + 1 + this.payload.length + 1;

        if (totalLength > 255) {
            throw new Error(`Packet too large: ${totalLength} bytes`);
        }

        const buffer = new Uint8Array(totalLength);
        
        buffer[0] = VenusPacket.MAGIC;
        buffer[1] = totalLength;
        buffer[2] = 0x23;
        buffer[3] = this.commandId;
        
        buffer.set(this.payload, 4);
        
        const dataToCheck = buffer.subarray(0, totalLength - 1);

        buffer[totalLength - 1] = VenusPacket.calculateChecksum(dataToCheck);

        return buffer;
    }

    static calculateChecksum(data: Uint8Array): number {
        let xor = 0;
        for (let i = 0; i < data.length; i++) {
            xor = xor ^ data[i];
        }
        return xor;
    }
    
    static fromBytes(data: DataView): VenusPacket {
        const bytes = new Uint8Array(data.buffer);

        if (bytes.length < 5) {
            throw new Error("Packet too short");
        }
        if (bytes[0] !== VenusPacket.MAGIC) {
            throw new Error("Invalid Magic Byte");
        }

        const len = bytes[1];
        if (len !== bytes.length) {
            throw new Error("Packet length mismatch");
        }

        const receivedChecksum = bytes[bytes.length - 1];
        const calcChecksum = VenusPacket.calculateChecksum(bytes.subarray(0, bytes.length - 1));

        if (receivedChecksum !== calcChecksum) {
            console.warn(`Checksum mismatch! Exp: ${calcChecksum.toString(16)}, Got: ${receivedChecksum.toString(16)}`);
        }

        const cmd = bytes[3];
        const payload = bytes.subarray(4, bytes.length - 1);

        return new VenusPacket(cmd, payload);
    }
}
