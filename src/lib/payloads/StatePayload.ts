import { VenusPayload } from "./VenusPayload";

export interface StateAttributes {
    BackupPower: boolean;
    DischargePowerLimit: number;

    SurplusFeedIn?: boolean
    DepthOfDischarge?: number; // percent, also FIXME naming? The app calls it that, but it's a bad name
    LEDLight?: boolean;
}

export class StatePayload extends VenusPayload {
    public attributes: StateAttributes;

    constructor(attributes: StateAttributes) {
        super();
        this.attributes = attributes;
    }

    static FROM_BYTES(bytes: Uint8Array): StatePayload {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        
        const attrs: StateAttributes = {
            BackupPower: bytes[49] === 0x01,
            DischargePowerLimit: view.getUint16(74, true)
        };
        
        if (bytes.length > 110) {
            attrs.SurplusFeedIn = bytes[133] === 0x01;
            attrs.DepthOfDischarge = bytes[149];
            attrs.LEDLight = bytes[152] === 0x01;
        }

        return new StatePayload(attrs);
    }

    toBytes(): Uint8Array {
        return new Uint8Array(0);
    }
}