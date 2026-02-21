import { VenusPayload } from "./VenusPayload";

export class CTReadingsPayload extends VenusPayload {
    public l1: number;
    public l2: number;
    public l3: number;
    public total: number;
    public device: number;

    constructor(l1: number, l2: number, l3: number, total: number, device: number) {
        super();
        this.l1 = l1;
        this.l2 = l2;
        this.l3 = l3;
        this.total = total;
        this.device = device;
    }

    static FROM_BYTES(bytes: Uint8Array): CTReadingsPayload {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        return new CTReadingsPayload(
            view.getInt32(0, true),
            view.getInt32(4, true),
            view.getInt32(8, true),
            view.getInt32(12, true),
            view.getInt16(16, true)
        );
    }

    toBytes(): Uint8Array {
        const buffer = new ArrayBuffer(18);
        const view = new DataView(buffer);

        view.setInt32(0, this.l1, true);
        view.setInt32(4, this.l2, true);
        view.setInt32(8, this.l3, true);
        view.setInt32(12, this.total, true);
        view.setInt16(16, this.device, true);

        return new Uint8Array(buffer);
    }
}