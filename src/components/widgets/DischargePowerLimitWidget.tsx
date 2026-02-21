import React, { useEffect, useState, useRef } from 'react';
import {
    Paper, Typography, Box, CircularProgress,
    ToggleButton, ToggleButtonGroup, Fade, Alert
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';

import { useBLE, useVenusData } from '../../contexts/BLEContext';
import { CommandId } from '../../lib/VenusPacket';
import { ConnectionState } from '../../lib/BLEConnectionManager';
import { DischargePowerLimitControlPayload } from '../../lib/payloads/DischargePowerLimitControlPayload';

interface Props {
    option1?: number; 
    option2?: number;
}

export const DischargePowerLimitWidget = ({ option1 = 800, option2 = 1200 }: Props) => {
    const { sendPacket, connectionState, pollState } = useBLE();
    const isConnected = connectionState === ConnectionState.CONNECTED;

    const stateData = useVenusData(CommandId.STATE);
    const serverValue = stateData?.attributes.DischargePowerLimit;
    
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const busyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    useEffect(() => {
        if (serverValue !== undefined && !isBusy) {
            setSelectedValue(serverValue);
        }
    }, [serverValue, isBusy]);
    
    useEffect(() => {
        if (isBusy && serverValue !== undefined && selectedValue !== null) {
            if (serverValue === selectedValue) {
                if (busyTimeoutRef.current) clearTimeout(busyTimeoutRef.current);
                setIsBusy(false);
            }
        }
    }, [serverValue, isBusy, selectedValue]);

    const handleChange = async (_: React.MouseEvent<HTMLElement>, newVal: number | null) => {
        if (newVal === null) {
            return;
        }
        if (!isConnected || isBusy) {
            return;
        }

        setSelectedValue(newVal);
        setIsBusy(true);

        if (busyTimeoutRef.current) clearTimeout(busyTimeoutRef.current);
        busyTimeoutRef.current = setTimeout(() => {
            setIsBusy(false);

            if (serverValue !== undefined) {
                setSelectedValue(serverValue);
            }
        }, 7_500);

        try {
            const payload = new DischargePowerLimitControlPayload(newVal);
            await sendPacket(CommandId.DISCHARGE_POWER_LIMIT_CONTROL, payload.toBytes());
            pollState();
        } catch (err) {
            console.error("Failed to set export limit", err);
            setIsBusy(false);

            if (serverValue !== undefined) {
                setSelectedValue(serverValue);
            }
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, minHeight: '72px', bgcolor: 'secondary.dark', color: 'secondary.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BoltIcon />
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                    Discharge Power Limit
                </Typography>
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {!isConnected ? (
                    <Typography variant="body2" color="text.secondary">Waiting for connection...</Typography>
                ) : serverValue === undefined ? (
                    <Box textAlign="center">
                        <CircularProgress size={24} />
                        <Typography variant="caption" display="block" mt={1}>Syncing...</Typography>
                    </Box>
                ) : (
                    <Box width="100%" textAlign="center">
                        <ToggleButtonGroup
                            value={selectedValue}
                            exclusive
                            onChange={handleChange}
                            disabled={!isConnected || isBusy}
                            fullWidth
                            color="primary"
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton value={option1} sx={{ py: 2, fontWeight: 'bold' }}>
                                {option1} W
                            </ToggleButton>
                            <ToggleButton value={option2} sx={{ py: 2, fontWeight: 'bold' }}>
                                {option2} W
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Box height={24} display="flex" justifyContent="center" alignItems="center">
                            {isBusy ? (
                                <Fade in={true}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CircularProgress size={16} color="inherit" />
                                        <Typography variant="caption">Updating...</Typography>
                                    </Box>
                                </Fade>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    Something something local regulations.<br/>
                                    Keep in mind that they might actually exist for a reason
                                </Typography>
                            )}
                        </Box>

                        {selectedValue !== null && selectedValue !== option1 && selectedValue !== option2 && !isBusy && (
                            <Alert severity="info" icon={false} sx={{ mt: 2, py: 0 }}>
                                Custom Value: {selectedValue} W
                            </Alert>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};
