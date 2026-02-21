export const COMMAND_ID = Object.freeze({
    STATE: 0x03,
    DEVICE_INFO: 0x04,
    FACTORY_RESET: 0x06,

    BACKUP_POWER_CONTROL: 0x0F,
    DISCHARGE_POWER_LIMIT_CONTROL: 0x15,
    
    CT_TYPE_CONTROL: 0x18,
    CT_MODE_CONTROL: 0x19,
    
    CT_READINGS: 0x1A,

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
