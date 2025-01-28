import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '@toolpad/core';
import DialogWithDeviceConfiguration from '../../components/dialogs/DialogWithDeviceConfiguration.tsx';
import AddSmartMeterDialog from '../../components/dialogs/AddSmartMeterDialog.tsx';
import { MediaQueryTabletMaxWidthStr, SmaiaXAbsoluteRoutes } from '../../constants/constants.ts';
import Button from '@mui/material/Button';
import SmartMeterCard from '../../components/smartMeter/SmartMeterCard.tsx';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import RemoveSmartMeterDialog from '../../components/dialogs/RemoveSmartMeterDialog.tsx';

const SmartMetersPage = () => {
    const theme = useTheme();

    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[]>([]);
    const [isSmartMetersCallPending, setIsSmartMetersCallPending] = useState(true);
    const [recentlyAddedSmartMeterName, setRecentlyAddedSmartMeterName] = useState<string | undefined>(undefined);

    const { getSmartMeters } = useSmartMeterService();
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);
    const dialogs = useDialogs();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const hasExecutedInitialLoadSmartMeters = useRef(false);
    useEffect(() => {
        if (hasExecutedInitialLoadSmartMeters.current) {
            return;
        }

        void loadSmartMeters();
        hasExecutedInitialLoadSmartMeters.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSmartMeters = async (recentlyAddedSmartMeterName?: string) => {
        try {
            setIsSmartMetersCallPending(true);
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
            showSnackbar('error', 'Failed to load smart meters!');
        } finally {
            setIsSmartMetersCallPending(false);
        }
    };

    const openDialogWithDeviceConfigurationDialog = async (smartMeterId: string) => {
        await dialogs.open(DialogWithDeviceConfiguration, { smartMeterId: smartMeterId });
    };

    const openRemoveSmartMeterDialog = async (smartMeterId: string) => {
        await dialogs.open(RemoveSmartMeterDialog, {
            smartMeterId: smartMeterId,
            reloadSmartMeters: () => {
                void loadSmartMeters();
            },
        });
    };

    const openAddSmartMeterDialog = async () => {
        await dialogs.open(AddSmartMeterDialog, {
            reloadSmartMeters: (smartMeterName) => {
                void loadSmartMeters(smartMeterName);
            },
            isSmartMeterNameUnique: (smartMeterName) => {
                return !smartMeters.map((smartMeter) => smartMeter.name).includes(smartMeterName);
            },
        });
    };

    return (
        <PageContainer title={''}>
            {isSmartMetersCallPending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : smartMeters.length <= 0 ? (
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: theme.palette.background.paper,
                        height: '151px',
                        width: isSmallScreen ? '100%' : '50%',
                        minWidth: isSmallScreen ? '' : '532px',
                        alignSelf: 'center',
                        borderRadius: '8px',
                        padding: '1em',
                        margin: '1em',
                        boxShadow: theme.shadows[1],
                    }}>
                    <Box>No smart meters found.</Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '1em',
                        }}>
                        <Button onClick={() => void navigate(SmaiaXAbsoluteRoutes.ORDERS)}>👉 Buy One Here 👈</Button>
                        <Button
                            onClick={() => {
                                void openAddSmartMeterDialog();
                            }}>
                            ⚡Add an existing smart meter⚡
                        </Button>
                    </Box>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                    <Box sx={{ padding: '1em' }}>
                        <Grid
                            container
                            spacing={2}
                            justifyContent="flex-start"
                            alignItems="center"
                            sx={{ width: '100%' }}
                            component="div">
                            {smartMeters.map((smartMeterOverview) => (
                                <Grid size={isSmallScreen ? 12 : 6} key={smartMeterOverview.id} component="div">
                                    <SmartMeterCard
                                        smartMeterOverview={smartMeterOverview}
                                        navigateToDetails={() => {
                                            void navigate(smartMeterOverview.id);
                                        }}
                                        kebabItems={[
                                            {
                                                name: 'Device configuration',
                                                onClick: () =>
                                                    void openDialogWithDeviceConfigurationDialog(smartMeterOverview.id),
                                            },
                                            {
                                                name: 'Remove smart meter',
                                                onClick: () => void openRemoveSmartMeterDialog(smartMeterOverview.id),
                                            },
                                        ]}
                                        isRecentlyAdded={recentlyAddedSmartMeterName === smartMeterOverview.name}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'right', paddingRight: '1em' }}>
                        <Button
                            variant="contained"
                            size="medium"
                            onClick={() => {
                                void openAddSmartMeterDialog();
                            }}>
                            Add Smart Meter
                        </Button>
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
};

export default SmartMetersPage;
