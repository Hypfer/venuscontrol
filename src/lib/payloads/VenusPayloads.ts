import { DeviceInfoPayload } from './DeviceInfoPayload';
import {CommandId} from "../VenusPacket.ts";

export interface VenusPayloadStatic<T> {
    new (...args: any[]): any; 
    FROM_BYTES(bytes: Uint8Array): T;
}

export const VenusRegistry = {
    [CommandId.DEVICE_INFO]: DeviceInfoPayload,
} as const;

export type VenusData<ID extends keyof typeof VenusRegistry> =
    ReturnType<typeof VenusRegistry[ID]['FROM_BYTES']>;
