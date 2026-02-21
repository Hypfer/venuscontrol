import {Box, Grid} from '@mui/material';
import { DeviceInfoWidget } from '../widgets/DeviceInfoWidget';
import { FactoryResetWidget } from '../widgets/FactoryResetWidget';
import { StateWidget } from '../widgets/StateWidget';
import {TogglesWidget} from "../widgets/TogglesWidget.tsx";

export const VenusAView = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <DeviceInfoWidget />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <StateWidget />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <TogglesWidget />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <FactoryResetWidget />
                </Grid>
            </Grid>
        </Box>
    );
};
