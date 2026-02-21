import { VenusPayload } from "./VenusPayload";

export class LedControlPayload extends VenusPayload {
    public isOn: boolean;

    constructor(isOn: boolean) {
        super();
        this.isOn = isOn;
    }

    static FROM_BYTES(bytes: Uint8Array): LedControlPayload {
        return new LedControlPayload(bytes[0] === 1);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.isOn ? 1 : 0]);
    }
}
