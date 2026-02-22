import { VenusPayload } from "./VenusPayload.ts";
import { WORK_MODE } from "../VenusConst.ts";

export class SetWorkModePayload extends VenusPayload {
    public mode: WORK_MODE;

    constructor(mode: WORK_MODE) {
        super();
        this.mode = mode;
    }

    static FROM_BYTES(bytes: Uint8Array): SetWorkModePayload {
        return new SetWorkModePayload(bytes[0] as WORK_MODE);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.mode]);
    }
}
