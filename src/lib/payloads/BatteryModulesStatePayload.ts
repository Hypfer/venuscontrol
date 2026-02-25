import { VenusPayload } from "./VenusPayload";

export interface BatteryModuleState {
    index: number;
    soc: number;
    status: number;
    temperature: number;
}

export class BatteryModulesStatePayload extends VenusPayload {
    public moduleCount: number;
    public moduleStates: BatteryModuleState[];

    constructor(moduleCount: number, modules: BatteryModuleState[]) {
        super();
        this.moduleCount = moduleCount;
        this.moduleStates = modules;
    }

    static FROM_BYTES(bytes: Uint8Array): BatteryModulesStatePayload {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        // Byte 0: Module Count
        const count = view.getUint8(0);
        
        const modules: BatteryModuleState[] = [];
        let offset = 7;

        for (let i = 0; i < count; i++) {
            const rawSoc = view.getUint16(offset, true);
            const soc = rawSoc / 10.0;

            const status = view.getUint8(offset + 2);
            const temperature = view.getUint16(offset + 3, true) / 10;

            modules.push({
                index: i + 1,
                soc,
                status,
                temperature
            });

            offset += 5;
        }

        return new BatteryModulesStatePayload(count, modules);
    }

    toBytes(): Uint8Array {
        return new Uint8Array();
    }
}
