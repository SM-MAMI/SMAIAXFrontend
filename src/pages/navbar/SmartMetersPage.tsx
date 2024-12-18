import { CircularProgress, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '@toolpad/core';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';
import CustomAddSmartMeterDialog from '../../components/dialogs/CustomAddSmartMeterDialog.tsx';
import { MediaQueryTabletMaxWidthStr } from '../../constants/constants.ts';
import Button from '@mui/material/Button';
import CustomSmartMeterCard from '../../components/smartMeter/CustomSmartMeterCard.tsx';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';

const SmartMetersPage = () => {
    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[] | undefined>(undefined);
    const [recentlyAddedSmartMeterName, setRecentlyAddedSmartMeterName] = useState<string | undefined>(undefined);

    const { getSmartMeters } = useSmartMeterService();
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);
    const dialogs = useDialogs();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        void loadSmartMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSmartMeters = async (recentlyAddedSmartMeterName?: string) => {
        try {
            const smartMeters = await getSmartMeters();
            const sortedSmartMeters = smartMeters
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) =>
                    a.name === recentlyAddedSmartMeterName ? -1 : b.name === recentlyAddedSmartMeterName ? 1 : 0
                );
            setSmartMeters(sortedSmartMeters);
            setRecentlyAddedSmartMeterName(recentlyAddedSmartMeterName);

            if (recentlyAddedSmartMeterName) {
                setTimeout(() => {
                    setRecentlyAddedSmartMeterName(undefined);
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meters!`);
        }
    };

    const openDialogWithDeviceConfigurationDialog = async () => {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    };

    const openAddSmartMeterDialog = async () => {
        await dialogs.open(CustomAddSmartMeterDialog, {
            reloadSmartMeters: (smartMeterName) => {
                void loadSmartMeters(smartMeterName);
            },
            isSmartMeterNameUnique: (smartMeterName) => {
                if (smartMeters == null) {
                    return false;
                }

                return !smartMeters.map((smartMeter) => smartMeter.name).includes(smartMeterName);
            },
        });
    };

    return (
        <PageContainer title={''}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div style={{ padding: '1em' }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ width: '100%' }}
                        component="div">
                        {!smartMeters ? (
                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }} component="div">
                                <CircularProgress size="3em" />
                            </Grid>
                        ) : (
                            smartMeters.map((smartMeterOverview) => (
                                <Grid size={isSmallScreen ? 12 : 6} key={smartMeterOverview.id} component="div">
                                    <CustomSmartMeterCard
                                        smartMeterOverview={smartMeterOverview}
                                        navigateToDetails={() => {
                                            navigate(`/smart-meters/${smartMeterOverview.id}`);
                                        }}
                                        kebabItems={[
                                            {
                                                name: 'Device configuration',
                                                onClick: () => openDialogWithDeviceConfigurationDialog(),
                                            },
                                        ]}
                                        isRecentlyAdded={recentlyAddedSmartMeterName === smartMeterOverview.name}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </div>

                <div style={{ display: 'flex', justifyContent: 'right', paddingRight: '1em' }}>
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => {
                            void openAddSmartMeterDialog();
                        }}>
                        Add Smart Meter
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
};

export default SmartMetersPage;
