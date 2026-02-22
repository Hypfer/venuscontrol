import { VenusPayload } from "./VenusPayload";

export class BluetoothControlPayload extends VenusPayload {
    public isEnabled: boolean;

    constructor(isEnabled: boolean) {
        super();
        this.isEnabled = isEnabled;
    }

    static FROM_BYTES(bytes: Uint8Array): BluetoothControlPayload {
        return new BluetoothControlPayload(bytes[1] === 1);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([0x0a, this.isEnabled ? 1 : 0]);
    }
}
