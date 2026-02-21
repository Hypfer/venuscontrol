import {Box, Grid} from '@mui/material';
import { DeviceInfoWidget } from '../widgets/DeviceInfoWidget';

export const VenusAView = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <DeviceInfoWidget />
                </Grid>
            </Grid>
        </Box>
    );
};
