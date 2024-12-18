import { useActivePage, useDialogs } from '@toolpad/core';
import { PolicyDto, SmartMeterDto } from '../../api/openAPI';
import { Location, useLocation, useParams } from 'react-router-dom';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import invariant from '../../utils/tiny-invariant.ts';
import { Button, CircularProgress, Typography } from '@mui/material';
import CustomCreateEditMetadataDialog from '../../components/dialogs/CustomCreateEditMetadataDialog.tsx';
import CustomCreatePolicyDialog from '../../components/dialogs/CustomCreatePolicyDialog.tsx';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';
import MetadataDrawer from '../../components/smartMeter/MetadataDrawer.tsx';
import { PageContainer } from '@toolpad/core/PageContainer';
import { usePolicyService } from '../../hooks/services/usePolicyService.ts';
import SmartMeterPoliciesTable from '../../components/tables/SmartMeterPoliciesTable.tsx';

type LocationState = {
    openDialog?: boolean;
};

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);
    const [smartMeterPolicies, setSmartMeterPolicies] = useState<PolicyDto[] | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const params = useParams<{ id: string }>();
    const location = useLocation() as Location<LocationState>;

    const activePage = useActivePage();
    const dialogs = useDialogs();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();
    const { getPoliciesBySmartMeterId } = usePolicyService();

    const previousBreadcrumbs = activePage?.breadcrumbs ?? [];
    const breadcrumbs = smartMeter
        ? [
              ...previousBreadcrumbs,
              {
                  title: smartMeter.name,
                  path: '/' + smartMeter.id,
              },
          ]
        : previousBreadcrumbs;

    invariant(activePage, 'No navigation match');

    useEffect(() => {
        void loadSmartMeter();

        if (location.state.openDialog === true) {
            void openCreateEditMetadataDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    useEffect(() => {
        if (smartMeter?.id) {
            void loadSmartMeterPolicies(smartMeter.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeter]);

    const loadSmartMeter = async () => {
        if (!params.id) {
            throw new Error('Smart meter id not submitted.');
        }
        try {
            const smartMeter = await getSmartMeter(params.id);
            setSmartMeter(smartMeter);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meter!`);
        }
    };

    const loadSmartMeterPolicies = async (smartMeterId: string) => {
        try {
            const smartMeterPolicies = await getPoliciesBySmartMeterId(smartMeterId);
            setSmartMeterPolicies(smartMeterPolicies);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meter policies!`);
        }
    };

    const openCreateEditMetadataDialog = async () => {
        await dialogs.open(CustomCreateEditMetadataDialog, {
            smartMeterId: smartMeter?.id ?? '',
            metadata: undefined,
            reloadSmartMeter: () => {
                void loadSmartMeter();
            },
        });
    };

    const openCreatePolicyDialog = async () => {
        await dialogs.open(CustomCreatePolicyDialog, {
            smartMeterId: smartMeter?.id ?? '',
            reloadPolicies: (smartMeterId: string) => {
                void loadSmartMeterPolicies(smartMeterId);
            },
        });
    };

    const openCustomDialogWithDeviceConfiguration = async () => {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    };

    return (
        <PageContainer title={''} breadcrumbs={breadcrumbs}>
            {smartMeter == undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : (
                <>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            width: '100%',
                            gap: '10px',
                        }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                setIsDrawerOpen(true);
                            }}>
                            Show Metadata
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                void openCreateEditMetadataDialog();
                            }}>
                            Create Metadata
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                void openCustomDialogWithDeviceConfiguration();
                            }}>
                            Device configuration
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                void openCreatePolicyDialog();
                            }}>
                            Create Policy
                        </Button>
                    </div>

                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>
                            Smart Meter Policies
                        </Typography>
                        <SmartMeterPoliciesTable policies={smartMeterPolicies || []} />
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
