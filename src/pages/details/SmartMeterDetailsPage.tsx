import { useActivePage } from '@toolpad/core';
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
    const [openAddMetadata, setOpenAddMetadata] = useState<boolean>(false);
    const [openCreatePolicy, setOpenCreatePolicy] = useState<boolean>(false);

    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const activePage = useActivePage();
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
            setOpenAddMetadata(true);
            searchParams[0].delete('open');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

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
                        setOpenAddMetadata(true);
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
                        setOpenCreatePolicy(true);
                    }}>
                    Create Policy
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
            <CreatePolicyDialog
                smartMeterId={smartMeter?.id ?? ''}
                open={openCreatePolicy}
                onOk={() => {
                    setOpenCreatePolicy(false);
                }}
                onCancel={() => {
                    setOpenCreatePolicy(false);
                }}
            />
        </>
    );
};

export default SmartMeterDetailsPage;
