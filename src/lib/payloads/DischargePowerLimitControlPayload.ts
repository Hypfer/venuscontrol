import { VenusPayload } from "./VenusPayload";

export class DischargePowerLimitControlPayload extends VenusPayload {
    public limit: number;

    constructor(limit: number) {
        super();
        this.limit = limit;
    }

    static FROM_BYTES(bytes: Uint8Array): DischargePowerLimitControlPayload {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return new DischargePowerLimitControlPayload(view.getUint16(0, true));
    }

    toBytes(): Uint8Array {
        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        
        view.setUint16(0, this.limit, true);

        return new Uint8Array(buffer);
    }
}