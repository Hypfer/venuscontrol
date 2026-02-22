import { VenusPayload } from "./VenusPayload";

// FIXME: why is there no Grid connected flag?

export interface StateAttributes {
    UnknownPower01: number; // FIXME: TBD
    BatteryPower: number;
    InverterState: number; // As per INVERTER_STATE
    CTConnected: boolean;

    // Not all of this is usable, given that the battery won't discharge below 10%. Not sure why it gives us this number
    // Or maybe it does, but just in emergency power mode?
    RemainingEnergy: number;
    SoC: number;
    
    // These must need a time reference. FIXME: how does the thing even know the time? And can we know which time it knows?
    DailyEnergyIn: number;
    DailyEnergyOut: number;
    MonthlyEnergyIn: number;
    MonthlyEnergyOut: number;
    
    WorkMode: number; // As per WORK_MODE
    
    TotalEnergyIn: number;
    TotalEnergyOut: number;

    BackupPower: boolean;
    DischargePowerLimit: number;
    CTType: number; // As per CT_TYPE
    Phase: number; // As per PHASE
    CTMode: number; // As per CT_MODE

    SurplusFeedIn?: boolean
    
    UnknownPower02?: number;
    UnknownPower03?: number;
    GridPower?: number;
    UnknownPower05?: number;

    BLEDisabled?: boolean;
    DepthOfDischarge?: number; // percent, also FIXME naming? The app calls it that, but it's a bad name
    LEDLight?: boolean;
}

export class StatePayload extends VenusPayload {
    public attributes: StateAttributes;

    constructor(attributes: StateAttributes) {
        super();
        this.attributes = attributes;
    }

    static FROM_BYTES(bytes: Uint8Array): StatePayload {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        
        const attrs: StateAttributes = {
            UnknownPower01: view.getInt16(0, true), // FIXME: Could be the backup outlet?
            BatteryPower: view.getInt16(2, true),
            InverterState: bytes[4],

            CTConnected: bytes[7] === 0x01,
            
            RemainingEnergy: view.getInt16(9, true),
            SoC: bytes[11],
            
            DailyEnergyIn: view.getUint32(14, true),
            MonthlyEnergyIn: view.getUint32(18, true),
            DailyEnergyOut: view.getUint32(22, true),
            MonthlyEnergyOut: view.getUint32(26, true),
            
            WorkMode: bytes[38],

            TotalEnergyIn: view.getUint32(41, true),
            TotalEnergyOut: view.getUint32(45, true),

            BackupPower: bytes[49] === 0x01,
            
            // FIXME Maybe the 4 MPPT hide here? in 50-73? Or maybe not

            DischargePowerLimit: view.getUint16(74, true),
            CTType: bytes[76],
            Phase: bytes[77],
            CTMode: bytes[78],
        };
        
        if (bytes.length > 110) {
            attrs.SurplusFeedIn = bytes[133] === 0x01;
            
            attrs.UnknownPower02 = view.getInt16(140, true);
            attrs.UnknownPower03 = view.getInt16(142, true);
            
            // Inverted, because the reported value is from a battery perspective, which is incorrect
            attrs.GridPower = view.getInt16(144, true) * -1 // FIXME: verify
            
            attrs.UnknownPower05 = view.getInt16(146, true);

            attrs.BLEDisabled = bytes[148] === 0x00;
            attrs.DepthOfDischarge = bytes[149];
            attrs.LEDLight = bytes[152] === 0x01;
        }

        return new StatePayload(attrs);
    }

    toBytes(): Uint8Array {
        return new Uint8Array(0);
    }
}
