export const COMMAND_ID = Object.freeze({
    STATE: 0x03,
    DEVICE_INFO: 0x04,
    FACTORY_RESET: 0x06,

    BACKUP_POWER_CONTROL: 0x0F,
    DISCHARGE_POWER_LIMIT_CONTROL: 0x15,
    
    CT_TYPE_CONTROL: 0x18,
    CT_MODE_CONTROL: 0x19,
    
    CT_READINGS: 0x1A,
    
    PHASE_AUTODETECTION: 0x1D,

    SURPLUS_FEED_IN_CONTROL: 0x41,
    BATTERY_MODULES_STATE: 0x42,

    DEPTH_OF_DISCHARGE_CONTROL: 0x54,

    LED_CONTROL: 0x59
})

export type COMMAND_ID = (typeof COMMAND_ID)[keyof typeof COMMAND_ID];

export const CT_TYPE = Object.freeze({
    SHELLY_PRO_3EM: 0x01,
    
    MARSTEK_CT003: 0x04,
    SHELLY_3EM: 0x05,
    SHELLY_PRO_EM_50: 0x06,
});

export type CT_TYPE = (typeof CT_TYPE)[keyof typeof CT_TYPE];

export const CT_MODE = Object.freeze({
    SINGLE_PHASE: 0x00,
    THREE_PHASE: 0x01
});

export type CT_MODE = (typeof CT_MODE)[keyof typeof CT_MODE];

export const PHASE = Object.freeze({
    SCANNING: 0x00,
    
    L1: 0x01,
    L2: 0x02,
    L3: 0x03,
    
    // FIXME What is 0x04?
    ERROR: 0x05,
})

export type PHASE = (typeof PHASE)[keyof typeof PHASE];

export const INVERTER_STATE = Object.freeze({
    SLEEP: 0x00,
    STANDBY: 0x01,
    CHARGE: 0x02,
    DISCHARGE: 0x03,
    BACKUP: 0x04,
    OTA: 0x05,
    BYPASS: 0x06,
});

export type INVERTER_STATE = (typeof INVERTER_STATE)[keyof typeof INVERTER_STATE];
