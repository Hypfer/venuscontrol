import { VenusPayload } from "./VenusPayload";

export class DepthOfDischargeControlPayload extends VenusPayload {
    public percentage: number;

    constructor(percentage: number) {
        super();
        
        this.percentage = percentage;
    }

    static FROM_BYTES(bytes: Uint8Array): DepthOfDischargeControlPayload {
        return new DepthOfDischargeControlPayload(bytes[0]);
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.percentage]);
    }
}
