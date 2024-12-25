import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LocationDto, MetadataDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import dayjs from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar';
import { DialogProps } from '@toolpad/core';
import CustomCreateEditMetadataForm from '../smartMeter/CustomCreateEditMetadataForm.tsx';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

interface EditMetadataDialogPayload {
    smartMeterId: string;
    metadata: MetadataDto | undefined;
    reloadSmartMeter: () => void;
}

const CustomCreateEditMetadataDialog = ({
    payload,
    open,
    onClose,
}: Readonly<DialogProps<EditMetadataDialogPayload>>) => {
    const [title, setTitle] = useState<string>('Add Metadata');
    const [location, setLocation] = useState<LocationDto>({});
    const [validFrom, setValidFrom] = useState(dayjs().toISOString());
    const [householdSize, setHouseholdSize] = useState<number | undefined>(undefined);

    const { addMetadata, updateMetadata } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (payload.metadata === undefined) {
            return;
        }

        setTitle('Edit Metadata');

        setLocation(payload.metadata.location as LocationDto);
        setValidFrom(payload.metadata.validFrom);
        if (payload.metadata.householdSize) {
            setHouseholdSize(payload.metadata.householdSize);
        }
    }, [payload.metadata]);

    const handleSubmit = async () => {
        if (householdSize == null) {
            showSnackbar('error', 'Please add a valid household size');
            return;
        }

        const metadataCreateUpdateDto = {
            householdSize,
            location,
            validFrom,
        };

        try {
            if (payload.metadata) {
                await updateMetadata(payload.smartMeterId, payload.metadata.id, {
                    ...metadataCreateUpdateDto,
                    id: payload.metadata.id,
                });
                showSnackbar('success', 'Successfully updated metadata!');
            } else {
                await addMetadata(payload.smartMeterId, metadataCreateUpdateDto);
                showSnackbar('success', 'Successfully added metadata!');
            }
            payload.reloadSmartMeter();
            void onClose();
        } catch (error) {
            showSnackbar('error', `${payload.metadata ? 'Update' : 'Add'} metadata failed!`);
            console.error(`${payload.metadata ? 'Update' : 'Add'} metadata failed:`, error);
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <CustomCreateEditMetadataForm
                    location={location}
                    setLocation={setLocation}
                    householdSize={householdSize}
                    setHouseholdSize={setHouseholdSize}
                    validFrom={validFrom}
                    setValidFrom={setValidFrom}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        void handleSubmit();
                    }}
                    variant="outlined">
                    Ok
                </Button>
                <Button onClick={() => void onClose()} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomCreateEditMetadataDialog;
