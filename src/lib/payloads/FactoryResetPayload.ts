import { VenusPayload } from "./VenusPayload";

export const FactoryResetType = Object.freeze({
    FULL: 0x01,
    SETTINGS_ONLY: 0x02
})

export type FactoryResetType = (typeof FactoryResetType)[keyof typeof FactoryResetType];


export class FactoryResetPayload extends VenusPayload {
    public resetType: FactoryResetType;
    
    constructor(resetType: FactoryResetType) {
        super();
        
        this.resetType = resetType;
    }

    static FROM_BYTES(bytes: Uint8Array): FactoryResetPayload {
        return new FactoryResetPayload(bytes[0] as FactoryResetType);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.resetType]);
    }
}
