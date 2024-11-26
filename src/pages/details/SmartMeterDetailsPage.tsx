import { useActivePage, useDialogs } from '@toolpad/core';
import { SmartMeterDto } from '../../api/openAPI';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import invariant from '../../tiny-invariant.ts';
import { Button, Typography } from '@mui/material';
import EditMetadataDialog from '../../components/dialogs/EditMetadataDialog.tsx';
import CreatePolicyDialog from '../../components/dialogs/CreatePolicyDialog.tsx';

const SmartMeterDetailsPage = () => {
    const [smartMeter, setSmartMeter] = useState<SmartMeterDto | undefined>(undefined);

    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
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

        const open = searchParams[0].get('open');
        if (open) {
            void openEditMetadataDialog();
            searchParams[0].delete('open');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const openEditMetadataDialog = async () => {
        await dialogs.open(EditMetadataDialog, {
            smartMeterId: smartMeter?.id ?? '',
            isNew: true,
        });
    };

    const openCreatePolicyDialog = async () => {
        await dialogs.open(CreatePolicyDialog, {
            smartMeterId: smartMeter?.id ?? '',
        });
    };

    return (
        <>
            <Typography variant={'h6'}>{title}</Typography>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        void openEditMetadataDialog();
                    }}>
                    Edit
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        void openCreatePolicyDialog();
                    }}>
                    Create Policy
                </Button>
            </div>
        </>
    );
};

export default SmartMeterDetailsPage;
