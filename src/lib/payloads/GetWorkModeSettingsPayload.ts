import { VenusPayload } from "./VenusPayload.ts";
import { MANUAL_MODE_SCHEDULE_ITEM_ACTION } from "../VenusConst.ts";

export interface WorkModeSetting {
    slotIndex: number;
    action: MANUAL_MODE_SCHEDULE_ITEM_ACTION;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    days: number; // As per MANUAL_MODE_SCHEDULE_ITEM_DAY_BIT
    absolutePowerLimit: number;
    enabled: boolean;
    isEmpty: boolean;
}

export class GetWorkModeSettingsPayload extends VenusPayload {
    public settings: WorkModeSetting[];

    constructor(settings: WorkModeSetting[] = []) {
        super();
        this.settings = settings;
    }

    static FROM_BYTES(bytes: Uint8Array): GetWorkModeSettingsPayload {
        const settings: WorkModeSetting[] = [];
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        for (let i = 0; i < 10; i++) {
            const offset = i * 8;
            if (offset + 8 > bytes.length) break;

            const startHour = bytes[offset];
            const startMinute = bytes[offset + 1];
            const endHour = bytes[offset + 2];
            const endMinute = bytes[offset + 3];
            const days = bytes[offset + 4];
            const rawPower = view.getInt16(offset + 5, true);
            const enabled = bytes[offset + 7] === 0x01;

            let action: MANUAL_MODE_SCHEDULE_ITEM_ACTION = MANUAL_MODE_SCHEDULE_ITEM_ACTION.CHARGE;
            let absolutePowerLimit = 0;

            if (i === 9) {
                action = MANUAL_MODE_SCHEDULE_ITEM_ACTION.UPS;
                absolutePowerLimit = Math.abs(rawPower);
            } else if (rawPower === -1) {
                action = MANUAL_MODE_SCHEDULE_ITEM_ACTION.SELF_CONSUMPTION;
            } else if (rawPower < 0) {
                action = MANUAL_MODE_SCHEDULE_ITEM_ACTION.CHARGE;
                absolutePowerLimit = Math.abs(rawPower);
            } else {
                action = MANUAL_MODE_SCHEDULE_ITEM_ACTION.DISCHARGE;
                absolutePowerLimit = rawPower;
            }

            const isEmpty = startHour === 0 && startMinute === 0 && endHour === 0 && endMinute === 0 && !enabled;

            settings.push({
                slotIndex: i,
                action,
                startHour,
                startMinute,
                endHour,
                endMinute,
                days,
                absolutePowerLimit,
                enabled,
                isEmpty
            });
        }

        return new GetWorkModeSettingsPayload(settings);
    }

    toBytes(): Uint8Array {
        return new Uint8Array(0);
    }
}
