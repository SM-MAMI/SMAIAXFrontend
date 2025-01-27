import { ActivePage, Breadcrumb, useActivePage, useDialogs } from '@toolpad/core';
import { PolicyDto, SmartMeterDto } from '../../../api/openAPI';
import { Location, useLocation, useParams } from 'react-router-dom';
import { useSmartMeterService } from '../../../hooks/services/useSmartMeterService.ts';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from '../../../hooks/useSnackbar.ts';
import invariant from '../../../utils/tiny-invariant.ts';
import { Box, CircularProgress, Typography } from '@mui/material';
import CreateEditMetadataDialog from '../../../components/dialogs/CreateEditMetadataDialog.tsx';
import CreatePolicyDialog from '../../../components/dialogs/CreatePolicyDialog.tsx';
import DialogWithDeviceConfiguration from '../../../components/dialogs/DialogWithDeviceConfiguration.tsx';
import MetadataDrawer from '../../../components/smartMeter/MetadataDrawer.tsx';
import { PageContainer } from '@toolpad/core/PageContainer';
import { usePolicyService } from '../../../hooks/services/usePolicyService.ts';
import SmartMeterPoliciesTable from '../../../components/tables/SmartMeterPoliciesTable.tsx';
import KebabMenu from '../../../components/menus/KebabMenu.tsx';
import Button from '@mui/material/Button';
import MeasurementSection from '../../../components/measurement/MeasurementSection.tsx';
import Divider from '@mui/material/Divider';

type LocationState =
    | {
          openDialog?: boolean;
      }
    | undefined;

const generateBreadcrumbs = (smartMeter: SmartMeterDto | undefined, activePage: ActivePage | null): Breadcrumb[] => {
    const previousBreadcrumbs = activePage?.breadcrumbs ?? [];
    return smartMeter && activePage
        ? [
              ...previousBreadcrumbs,
              {
                  title: smartMeter.name,
                  path: `${activePage.path}/${smartMeter.id}`,
              },
          ]
        : previousBreadcrumbs;
};

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);
    const [smartMeterPolicies, setSmartMeterPolicies] = useState<PolicyDto[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSmartMeterCallPending, setIsSmartMeterCallPending] = useState(true);
    const [isSmartMeterPoliciesCallPending, setIsSmartMeterPoliciesCallPending] = useState(true);

    const params = useParams<{ id: string }>();
    const location = useLocation() as Location<LocationState>;

    const activePage = useActivePage();
    const dialogs = useDialogs();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();
    const { getPoliciesBySmartMeterId } = usePolicyService();

    const breadcrumbs = generateBreadcrumbs(smartMeter, activePage);

    invariant(activePage, 'No navigation match');

    const hasExecutedInitialLoadSmartMeter = useRef(false);
    useEffect(() => {
        if (!hasExecutedInitialLoadSmartMeter.current) {
            void loadSmartMeter();
            hasExecutedInitialLoadSmartMeter.current = true;
        }

        if (location.state?.openDialog === true) {
            void openCreateEditMetadataDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const hasExecutedInitialLoadSmartMeterPolicies = useRef(false);
    useEffect(() => {
        if (hasExecutedInitialLoadSmartMeterPolicies.current || !smartMeter?.id) {
            return;
        }

        void loadSmartMeterPolicies(smartMeter.id);
        hasExecutedInitialLoadSmartMeterPolicies.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeter]);

    const loadSmartMeter = async () => {
        if (!params.id) {
            throw new Error('Smart meter id not submitted.');
        }
        try {
            setIsSmartMeterCallPending(true);
            const smartMeter = await getSmartMeter(params.id);
            setSmartMeter(smartMeter);
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load smart meter!');
        } finally {
            setIsSmartMeterCallPending(false);
        }
    };

    const loadSmartMeterPolicies = async (smartMeterId: string) => {
        try {
            setIsSmartMeterPoliciesCallPending(true);
            const smartMeterPolicies = await getPoliciesBySmartMeterId(smartMeterId);
            setSmartMeterPolicies(smartMeterPolicies);
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load smart meter policies!');
        } finally {
            setIsSmartMeterPoliciesCallPending(false);
        }
    };

    const openCreateEditMetadataDialog = async () => {
        await dialogs.open(CreateEditMetadataDialog, {
            smartMeterId: smartMeter?.id ?? '',
            metadata: undefined,
            reloadSmartMeter: () => {
                void loadSmartMeter();
            },
        });
    };

    const openCreatePolicyDialog = async () => {
        await dialogs.open(CreatePolicyDialog, {
            smartMeterId: smartMeter?.id ?? '',
            reloadPolicies: (smartMeterId: string) => {
                void loadSmartMeterPolicies(smartMeterId);
            },
        });
    };

    const openCustomDialogWithDeviceConfiguration = async () => {
        await dialogs.open(DialogWithDeviceConfiguration, { smartMeterId: smartMeter?.id ?? '' });
    };

    const kebabItems = [
        {
            name: 'Show metadata',
            onClick: () => {
                setIsDrawerOpen(true);
            },
        },
        {
            name: 'Create metadata',
            onClick: () => {
                void openCreateEditMetadataDialog();
            },
        },
        {
            name: 'Device configuration',
            onClick: () => {
                void openCustomDialogWithDeviceConfiguration();
            },
        },
    ];

    return (
        <PageContainer title={''} breadcrumbs={breadcrumbs}>
            {isSmartMeterCallPending || isSmartMeterPoliciesCallPending ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : smartMeter === undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>No smart meter details available</div>
                </div>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}>
                        <Typography variant="h5" style={{}}>
                            {smartMeter.name}
                        </Typography>
                        <KebabMenu items={kebabItems} />
                    </Box>

                    <MeasurementSection smartMeterId={smartMeter.id} requestOnInitialLoad={true} />

                    <Divider sx={{ margin: '2em' }} />

                    <div style={{ padding: '1em', width: '100%' }}>
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}>
                                <Typography variant="h5" style={{}}>
                                    Smart Meter Policies
                                </Typography>
                            </Box>
                            <SmartMeterPoliciesTable policies={smartMeterPolicies} />
                        </Box>
                        <div style={{ display: 'flex', justifyContent: 'right', marginTop: '1em' }}>
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={() => {
                                    void openCreatePolicyDialog();
                                }}>
                                Create policy
                            </Button>
                        </div>
                    </div>

                    <MetadataDrawer
                        smartMeter={smartMeter}
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                        reloadSmartMeter={() => {
                            void loadSmartMeter();
                        }}
                    />
                </>
            )}
        </PageContainer>
    );
};

export default SmartMeterDetailsPage;
