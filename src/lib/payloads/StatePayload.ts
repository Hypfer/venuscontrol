import { VenusPayload } from "./VenusPayload";

export interface StateAttributes {
    BackupPower: boolean;

    SurplusFeedIn?: boolean
    LEDLight?: boolean;
}

export class StatePayload extends VenusPayload {
    public attributes: StateAttributes;

    constructor(attributes: StateAttributes) {
        super();
        this.attributes = attributes;
    }

    static FROM_BYTES(bytes: Uint8Array): StatePayload {
        const attrs: StateAttributes = {
            BackupPower: bytes[49] === 0x01
        };
        
        if (bytes.length > 110) {
            attrs.SurplusFeedIn = bytes[133] === 0x01;
            attrs.LEDLight = bytes[152] === 0x01;
        }

        return new StatePayload(attrs);
    }

    toBytes(): Uint8Array {
        return new Uint8Array(0);
    }
}