import {Box, Grid} from '@mui/material';
import { DeviceInfoWidget } from '../widgets/DeviceInfoWidget';
import { FactoryResetWidget } from '../widgets/FactoryResetWidget';
import { StateWidget } from '../widgets/StateWidget';
import {TogglesWidget} from "../widgets/TogglesWidget.tsx";
import {DepthOfDischargeWidget} from "../widgets/DepthOfDischargeWidget.tsx";
import {DischargePowerLimitWidget} from "../widgets/DischargePowerLimitWidget.tsx";

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
                    <DepthOfDischargeWidget min={30} max={88} />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <DischargePowerLimitWidget option1={800} option2={1200} />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <FactoryResetWidget />
                </Grid>
            </Grid>
        </Box>
    );
};
