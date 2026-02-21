import { DeviceInfoPayload } from './DeviceInfoPayload';
import {StatePayload} from "./StatePayload.ts";
import {LedControlPayload} from "./LedControlPayload.ts";
import {BackupPowerControlPayload} from "./BackupPowerControlPayload.ts";
import {SurplusFeedInControlPayload} from "./SurplusFeedInControlPayload.ts";
import {DepthOfDischargeControlPayload} from "./DepthOfDischargeControlPayload.ts";
import {DischargePowerLimitControlPayload} from "./DischargePowerLimitControlPayload.ts";
import {BatteryModulesStatePayload} from "./BatteryModulesStatePayload.ts";
import {COMMAND_ID} from "../VenusConst.ts";

export interface VenusPayloadStatic<T> {
    new (...args: any[]): any; 
    FROM_BYTES(bytes: Uint8Array): T;
}

export const VenusRegistry = {
    [COMMAND_ID.STATE]: StatePayload,
    [COMMAND_ID.DEVICE_INFO]: DeviceInfoPayload,
    
    [COMMAND_ID.BACKUP_POWER_CONTROL]: BackupPowerControlPayload,
    [COMMAND_ID.DISCHARGE_POWER_LIMIT_CONTROL]: DischargePowerLimitControlPayload,

    [COMMAND_ID.SURPLUS_FEED_IN_CONTROL]: SurplusFeedInControlPayload,
    [COMMAND_ID.BATTERY_MODULES_STATE]: BatteryModulesStatePayload,

    [COMMAND_ID.DEPTH_OF_DISCHARGE_CONTROL]: DepthOfDischargeControlPayload,
    [COMMAND_ID.LED_CONTROL]: LedControlPayload,
} as const;

export type VenusData<ID extends keyof typeof VenusRegistry> =
    ReturnType<typeof VenusRegistry[ID]['FROM_BYTES']>;
