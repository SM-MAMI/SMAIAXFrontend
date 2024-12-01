import { useActivePage, useDialogs } from '@toolpad/core';
import { SmartMeterDto } from '../../api/openAPI';
import { useLocation, useParams } from 'react-router-dom';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import invariant from '../../tiny-invariant.ts';
import { Button, CircularProgress, Typography } from '@mui/material';
import CustomEditMetadataDialog from '../../components/dialogs/CustomEditMetadataDialog.tsx';
import CustomCreatePolicyDialog from '../../components/dialogs/CustomCreatePolicyDialog.tsx';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';
import MetadataDrawer from '../../components/smartMeter/MetadataDrawer.tsx';

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
        void loadSmartMeter();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (location.state?.openDialog === true) {
            void openEditMetadataDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const openEditMetadataDialog = async () => {
        await dialogs.open(CustomEditMetadataDialog, {
            smartMeterId: smartMeter?.id ?? '',
            isNew: true,
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
        <>
            {smartMeter == undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : (
                <>
                    <Typography variant={'h4'}>{smartMeter.name}</Typography>
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
                                void openEditMetadataDialog();
                            }}>
                            Edit
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
                    />
                </>
            )}
        </>
    );
};

export default SmartMeterDetailsPage;
