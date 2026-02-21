import {
    Paper, Typography, Box, CircularProgress
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';

import { useBLE, useVenusData } from '../../contexts/BLEContext';
import { ConnectionState } from '../../lib/BLEConnectionManager';
import {COMMAND_ID} from "../../lib/VenusConst.ts";

export const StateWidget = () => {
    const { connectionState } = useBLE();
    const isConnected = connectionState === ConnectionState.CONNECTED;
    
    const data = useVenusData(COMMAND_ID.STATE);

    return (
        <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, minHeight: '72px', bgcolor: 'secondary.main', color: 'secondary.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon />
                <Typography variant="h6" fontWeight="bold">Realtime State</Typography>
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!isConnected ? (
                    <Typography variant="body2" color="text.secondary">Not connected</Typography>
                ) : !data ? (
                    <Box textAlign="center">
                        <CircularProgress size={20} sx={{ mb: 1 }} />
                        <Typography variant="caption" display="block" color="text.secondary">
                            Waiting for first poll...
                        </Typography>
                    </Box>
                ) : (
                    <Box textAlign="center">
                        <Typography color="text.secondary">
                            State Data Received
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};
