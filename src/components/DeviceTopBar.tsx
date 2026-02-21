import { AppBar, Toolbar, Typography, Chip, Button, Box } from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { ConnectionState } from '../lib/BLEConnectionManager';
import type {DeviceInfo} from "../lib/DeviceUtils.ts";

interface Props {
    deviceInfo: DeviceInfo;
    status: ConnectionState;
    rssi: number | null;
    onDisconnect: () => void;
    onReconnect: () => void;
}

export const DeviceTopBar = ({ deviceInfo, status, rssi, onDisconnect, onReconnect }: Props) => {
    const isConnected = status === ConnectionState.CONNECTED;
    
    let chipColor: "success" | "error" | "warning" | "default" = "default";
    if (isConnected) chipColor = "success";
    if (status === ConnectionState.CONNECTING) chipColor = "warning";
    if (status === ConnectionState.DISCONNECTED) chipColor = "error";

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" lineHeight={1.2}>
                        {deviceInfo.modelName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                        ID: {deviceInfo.id}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                    {rssi && (
                        <Box display="flex" alignItems="center" color="text.secondary" title="RSSI">
                            <SignalCellularAltIcon fontSize="small" />
                            <Typography variant="caption" ml={0.5}>{rssi} dBm</Typography>
                        </Box>
                    )}

                    <Chip
                        label={status}
                        color={chipColor}
                        size="small"
                        variant={isConnected ? "filled" : "outlined"}
                    />
                </Box>
                
                {isConnected ? (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={onDisconnect}
                    >
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={onReconnect}
                    >
                        Reconnect
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
