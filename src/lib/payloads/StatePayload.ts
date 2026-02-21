import { VenusPayload } from "./VenusPayload";

export interface StateAttributes {
    CTConnected: boolean;

    BackupPower: boolean;
    DischargePowerLimit: number;
    CTType: number; // As per CT_TYPE
    Phase: number; // As per PHASE
    CTMode: number; // As per CT_MODE

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
            CTConnected: bytes[7] === 0x01,

            BackupPower: bytes[49] === 0x01,

            DischargePowerLimit: view.getUint16(74, true),
            CTType: bytes[76],
            Phase: bytes[77],
            CTMode: bytes[78],
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
