import { VenusPayload } from "./VenusPayload";

export class BluetoothDisableControlPayload extends VenusPayload {
    public isDisabled: boolean;

    constructor(isDisabled: boolean) {
        super();
        this.isDisabled = isDisabled;
    }

    static FROM_BYTES(bytes: Uint8Array): BluetoothDisableControlPayload {
        return new BluetoothDisableControlPayload(bytes[0] === 1);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([0x0a, this.isDisabled ? 1 : 0]);
    }
}
