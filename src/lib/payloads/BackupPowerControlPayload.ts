import { VenusPayload } from "./VenusPayload";

export class BackupPowerControlPayload extends VenusPayload {
    public isOn: boolean;

    constructor(isOn: boolean) {
        super();
        this.isOn = isOn;
    }

    static FROM_BYTES(bytes: Uint8Array): BackupPowerControlPayload {
        return new BackupPowerControlPayload(bytes[0] === 1);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.isOn ? 1 : 0]);
    }
}
