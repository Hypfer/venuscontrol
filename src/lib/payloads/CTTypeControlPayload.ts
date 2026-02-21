import { VenusPayload } from "./VenusPayload";
import type {CT_TYPE} from "../VenusConst.ts";

export class CTTypeControlPayload extends VenusPayload {
    public ctType: CT_TYPE;

    constructor(ctType: CT_TYPE) {
        super();
        this.ctType = ctType;
    }

    static FROM_BYTES(bytes: Uint8Array): CTTypeControlPayload {
        return new CTTypeControlPayload(bytes[0] as CT_TYPE);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([
            this.ctType,
            0x30, 0x30, 0x30, 0x30, 0x30, 0x30, // These 12 ascii "0" might be the mac address of CTs that have more
            0x30, 0x30, 0x30, 0x30, 0x30, 0x30, // pairing going on? Not sure, but I only emulate a shelly
        ]);
    }
}
