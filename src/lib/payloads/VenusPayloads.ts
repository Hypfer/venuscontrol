import { DeviceInfoPayload } from './DeviceInfoPayload';
import {CommandId} from "../VenusPacket.ts";
import {StatePayload} from "./StatePayload.ts";
import {LedControlPayload} from "./LedControlPayload.ts";
import {BackupPowerControlPayload} from "./BackupPowerControlPayload.ts";
import {SurplusFeedInControlPayload} from "./SurplusFeedInControlPayload.ts";
import {DepthOfDischargeControlPayload} from "./DepthOfDischargeControlPayload.ts";

export interface VenusPayloadStatic<T> {
    new (...args: any[]): any; 
    FROM_BYTES(bytes: Uint8Array): T;
}

export const VenusRegistry = {
    [CommandId.STATE]: StatePayload,
    [CommandId.DEVICE_INFO]: DeviceInfoPayload,
    
    [CommandId.BACKUP_POWER_CONTROL]: BackupPowerControlPayload,

    [CommandId.SURPLUS_FEED_IN_CONTROL]: SurplusFeedInControlPayload,
    [CommandId.DEPTH_OF_DISCHARGE_CONTROL]: DepthOfDischargeControlPayload,
    [CommandId.LED_CONTROL]: LedControlPayload,
} as const;

export type VenusData<ID extends keyof typeof VenusRegistry> =
    ReturnType<typeof VenusRegistry[ID]['FROM_BYTES']>;
