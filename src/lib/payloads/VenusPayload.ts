export abstract class VenusPayload {
    abstract fromBytes(data: Uint8Array): void;

    abstract toBytes(): Uint8Array;
}