import { useActivePage, useDialogs } from '@toolpad/core';
import { SmartMeterDto } from '../../api/openAPI';
import { useLocation, useParams } from 'react-router-dom';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import invariant from '../../tiny-invariant.ts';
import { Button, Typography } from '@mui/material';
import EditMetadataDialog from '../../components/dialogs/EditMetadataDialog.tsx';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);
    const [openAddMetadata, setOpenAddMetadata] = useState<boolean>(false);

    const params = useParams<{ id: string }>();
    const location = useLocation();
    const activePage = useActivePage();
    const dialogs = useDialogs();
    const { showSnackbar } = useSnackbar();
    const { getSmartMeter } = useSmartMeterService();

    invariant(activePage, 'No navigation match');

    const title = useMemo<string>(() => {
        return smartMeter?.name ?? 'NOT FOUND';
    }, [smartMeter]);

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
        if (location.state?.openDialog) {
            setOpenAddMetadata(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    async function openDialog() {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    }

    return (
        <>
            <Typography variant={'h4'}>{title}</Typography>
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
                        setOpenAddMetadata(true);
                    }}>
                    Edit
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        void openDialog();
                    }}>
                    Device configuration
                </Button>
            </div>
            <EditMetadataDialog
                smartMeterId={smartMeter?.id ?? ''}
                isNew={true}
                open={openAddMetadata}
                onOk={(successful: boolean) => {
                    setOpenAddMetadata(!successful);
                }}
                onCancel={() => {
                    setOpenAddMetadata(false);
                }}
            />
        </>
    );
};

export default SmartMeterDetailsPage;
