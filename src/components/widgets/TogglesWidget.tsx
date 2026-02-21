import React, { useEffect, useState } from 'react';
import {
    Paper, Typography, Box, Switch, CircularProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import LightModeIcon from '@mui/icons-material/LightMode';
import BoltIcon from '@mui/icons-material/Bolt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import { useBLE, useVenusData } from '../../contexts/BLEContext';
import { CommandId } from '../../lib/VenusPacket';
import { ConnectionState } from '../../lib/BLEConnectionManager';
import { LedControlPayload } from '../../lib/payloads/LedControlPayload';
import { BackupPowerControlPayload } from "../../lib/payloads/BackupPowerControlPayload";
import { SurplusFeedInControlPayload } from "../../lib/payloads/SurplusFeedInControlPayload";

export const TogglesWidget = () => {
    const { sendPacket, connectionState, pollState } = useBLE();
    const isConnected = connectionState === ConnectionState.CONNECTED;

    const stateData = useVenusData(CommandId.STATE);

    const [ledControlBusy, setLedControlBusy] = useState(false);
    const [backupPowerBusy, setBackupPowerBusy] = useState(false);
    const [surplusFeedInBusy, setSurplusFeedInBusy] = useState(false);

    const hasState = !!stateData;

    const backupPowerOn = stateData?.attributes.BackupPower;

    
    const ledControlSupported = stateData?.attributes.LEDLight !== undefined;
    const ledOn = stateData?.attributes.LEDLight;

    const surplusFeedInSupported = stateData?.attributes.SurplusFeedIn !== undefined;
    const surplusFeedInOn = stateData?.attributes.SurplusFeedIn;

    useEffect(() => {
        if (stateData) {
            setBackupPowerBusy(false);
            setLedControlBusy(false);
            setSurplusFeedInBusy(false);
        }
    }, [stateData]);

    const handleBackupPowerToggle = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (!isConnected || backupPowerBusy) return;

        setBackupPowerBusy(true);
        try {
            const payload = new BackupPowerControlPayload(checked);
            await sendPacket(CommandId.BACKUP_POWER_CONTROL, payload.toBytes());

            pollState();
        } catch (err) {
            console.error("Failed to toggle Backup Power", err);
            setBackupPowerBusy(false);
        }
    };

    const handleLedToggle = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (!isConnected || ledControlBusy) return;

        setLedControlBusy(true);
        try {
            const payload = new LedControlPayload(checked);
            await sendPacket(CommandId.LED_CONTROL, payload.toBytes());

            pollState();
        } catch (err) {
            console.error("Failed to toggle LEDs", err);
            setLedControlBusy(false);
        }
    };

    const handleSurplusFeedInToggle = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (!isConnected || surplusFeedInBusy) return;

        setSurplusFeedInBusy(true);
        try {
            const payload = new SurplusFeedInControlPayload(checked);
            await sendPacket(CommandId.SURPLUS_FEED_IN_CONTROL, payload.toBytes());

            pollState();
        } catch (err) {
            console.error("Failed to toggle Surplus Feed-in", err);
            setSurplusFeedInBusy(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: "none" }}>
            <Box sx={{ p: 2, minHeight: '72px', bgcolor: 'warning.main', color: 'warning.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ToggleOnIcon />
                <Typography variant="h6" fontWeight="bold">Toggles</Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                {!hasState && isConnected ? (
                    <Box p={3} textAlign="center">
                        <CircularProgress size={24} />
                        <Typography variant="caption" display="block" mt={1}>Syncing...</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>

                        <ListItem divider>
                            <ListItemIcon>
                                <BoltIcon color={backupPowerOn ? "warning" : "disabled"} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Backup Power"
                                secondary="Keep supplying the inbuilt power outlet even when the grid is down"
                                sx={{ mr: 2 }}
                            />
                            <Switch
                                edge="end"
                                checked={!!backupPowerOn}
                                onChange={handleBackupPowerToggle}
                                disabled={!isConnected || backupPowerBusy}
                                color="warning"
                            />
                        </ListItem>

                        <ListItem divider>
                            <ListItemIcon>
                                <CurrencyExchangeIcon color={surplusFeedInOn && surplusFeedInSupported ? "warning" : "disabled"} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Surplus Feed-in"
                                secondary={!surplusFeedInSupported ? "Not supported by the current FW version" : "Feed excess solar energy back into the grid when the battery is full"}
                                sx={{ mr: 2 }}
                            />
                            <Switch
                                edge="end"
                                checked={!!surplusFeedInOn}
                                onChange={handleSurplusFeedInToggle}
                                disabled={!isConnected || !surplusFeedInSupported || surplusFeedInBusy}
                                color="warning"
                            />
                        </ListItem>

                        <ListItem divider>
                            <ListItemIcon>
                                <LightModeIcon color={ledOn && ledControlSupported ? "warning" : "disabled"} />
                            </ListItemIcon>
                            <ListItemText
                                primary="LED Light"
                                secondary={!ledControlSupported ? "Not supported by the current FW version" : "Control the front panel indicators"}
                                sx={{ mr: 2 }}
                            />
                            <Switch
                                edge="end"
                                checked={ledOn}
                                onChange={handleLedToggle}
                                disabled={!isConnected || !ledControlSupported || ledControlBusy}
                                color="warning"
                            />
                        </ListItem>

                    </List>
                )}
            </Box>
        </Paper>
    );
};
