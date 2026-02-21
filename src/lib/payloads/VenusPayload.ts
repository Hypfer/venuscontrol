export abstract class VenusPayload {
    // static FROM_BYTES(bytes: Uint8Array): VenusPayload;
    
    abstract toBytes(): Uint8Array;
}