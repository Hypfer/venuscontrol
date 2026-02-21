import { VenusPayload } from "./VenusPayload";

export class DeviceInfoPayload extends VenusPayload {
    public data: Map<string, string> = new Map();

    constructor(rawData?: Uint8Array) {
        super();
        if (rawData) {
            this.fromBytes(rawData);
        }
    }

    // Real-world example:
    // type=VNSA-0,id=4e4816323732595650110136,mac=682499eefdad,dev_ver=147,bms_ver=106,fc_ver=202409090159,inv_ver=113,mppt_v=0t
    fromBytes(data: Uint8Array): void {
        const text = new TextDecoder().decode(data);

        const pairs = text.split(',');

        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
                this.data.set(key.trim(), value.trim());
            }
        });
    }

    toBytes(): Uint8Array {
        const entries: string[] = [];
        this.data.forEach((val, key) => {
            entries.push(`${key}=${val}`);
        });
        const text = entries.join(',');
        
        return new TextEncoder().encode(text);
    }
    
    
    get deviceType(): string { 
        return this.data.get('type') || 'Unknown'; 
    }
    
    get deviceId(): string { 
        return this.data.get('id') || 'Unknown';
    }
    
    get macAddress(): string { 
        return this.data.get('mac') || 'Unknown'; 
    }
}
