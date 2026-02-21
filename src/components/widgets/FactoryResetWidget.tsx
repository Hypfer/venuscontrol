import { useState } from 'react';
import {
    Paper, Typography, Box, Button, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Snackbar, Alert,
    Stack
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useBLE } from '../../contexts/BLEContext';
import { CommandId } from '../../lib/VenusPacket';
import { FactoryResetPayload, FactoryResetType } from '../../lib/payloads/FactoryResetPayload';
import { ConnectionState } from '../../lib/BLEConnectionManager';

export const FactoryResetWidget = () => {
    const { sendPacket, disconnect, connectionState } = useBLE();
    const isConnected = connectionState === ConnectionState.CONNECTED;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<FactoryResetType>(FactoryResetType.SETTINGS_ONLY);

    const [toast, setToast] = useState<{ msg: string, severity: 'success' | 'info' | 'error' } | null>(null);

    const initiateReset = (type: FactoryResetType) => {
        setSelectedType(type);
        setDialogOpen(true);
    };

    const confirmReset = async () => {
        setDialogOpen(false);
        if (!isConnected) {
            return;
        }

        try {
            await sendPacket(CommandId.FACTORY_RESET, new FactoryResetPayload(selectedType).toBytes());

            setToast({
                msg: "Factory reset command sent. Disconnecting...",
                severity: 'info'
            });

            setTimeout(() => {
                disconnect();
            }, 1000);

        } catch (err) {
            console.error(err);
            setToast({ msg: "Failed to send factory reset command.", severity: 'error' });
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, minHeight: '72px', bgcolor: 'error.main', color: 'error.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteSweepIcon />
                <Typography variant="h6" fontWeight="bold">Factory Reset</Typography>
            </Box>
            
            <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack spacing={2}>
                    <Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="warning"
                            size="large"
                            startIcon={<SettingsBackupRestoreIcon />}
                            onClick={() => initiateReset(FactoryResetType.SETTINGS_ONLY)}
                            disabled={!isConnected}
                            sx={{ justifyContent: 'flex-start', py: 1.5 }}
                        >
                            Factory Reset and Keep Data
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={<DeleteForeverIcon />}
                            onClick={() => initiateReset(FactoryResetType.FULL)}
                            disabled={!isConnected}
                            sx={{ justifyContent: 'flex-start', py: 1.5 }}
                        >
                            Factory Reset
                        </Button>
                    </Box>
                </Stack>
            </Box>
            
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color={selectedType === FactoryResetType.FULL ? "error" : "warning"} />
                    Confirm Reset
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedType === FactoryResetType.SETTINGS_ONLY
                            ? "This will reset all device settings to default values."
                            : "This will reset EVERYTHING including historical energy statistics."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmReset} color={selectedType === FactoryResetType.FULL ? "error" : "warning"} variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!toast}
                autoHideDuration={6000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast?.severity} onClose={() => setToast(null)} variant="filled">
                    {toast?.msg}
                </Alert>
            </Snackbar>
        </Paper>
    );
};
