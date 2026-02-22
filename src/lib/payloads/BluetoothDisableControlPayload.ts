import { VenusPayload } from "./VenusPayload";

// FIXME: if this is inverted anyway, why not have a "Enable Bluetooth" toggle?
// This currently recreates what the app does, but maybe the app is incorrect, UX-wise?
export class BluetoothDisableControlPayload extends VenusPayload {
    public isDisabled: boolean;

    constructor(isDisabled: boolean) {
        super();
        this.isDisabled = isDisabled;
    }

    static FROM_BYTES(bytes: Uint8Array): BluetoothDisableControlPayload {
        return new BluetoothDisableControlPayload(bytes[0] === 0);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([0x0a, this.isDisabled ? 0 : 1]);
    }
}
