import { useActivePage, useDialogs } from '@toolpad/core';
import { SmartMeterDto } from '../../api/openAPI';
import { useLocation, useParams } from 'react-router-dom';
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

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const params = useParams<{ id: string }>();
    const location = useLocation();
    const activePage = useActivePage();
    const dialogs = useDialogs();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();

    invariant(activePage, 'No navigation match');

    useEffect(() => {
        void loadSmartMeter();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (location.state?.openDialog === true) {
            void openCreateEditMetadataDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const loadSmartMeter = async () => {
        if (!params.id) {
            throw new Error('Smart meter id not submitted.');
        }
        try {
            const sm = await getSmartMeter(params.id);
            setSmartMeter(sm);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meter!`);
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
        });
    };

    const openCustomDialogWithDeviceConfiguration = async () => {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    };

    return (
        <PageContainer title={'ADRIANOOOOOOOOOOOO'}>
            {smartMeter == undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : (
                <>
                    <Typography>{smartMeter.name}</Typography>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height: '100%',
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
