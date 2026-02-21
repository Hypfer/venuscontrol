import { VenusPayload } from "./VenusPayload";
import type {CT_MODE} from "../VenusConst.ts";

export class CTModeControlPayload extends VenusPayload {
    public ctMode: CT_MODE;

    constructor(ctMode: CT_MODE) {
        super();
        this.ctMode = ctMode;
    }

    static FROM_BYTES(bytes: Uint8Array): CTModeControlPayload {
        return new CTModeControlPayload(bytes[0] as CT_MODE);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.ctMode]);
    }
}
