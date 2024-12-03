import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LocationDto, MetadataCreateDto, MetadataDto } from '../../api/openAPI';
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

    const { addMetadata } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (payload.metadata !== undefined) {
            setTitle('Edit Metadata');
            setLocation(payload.metadata.location);
            setValidFrom(payload.metadata.validFrom);
            setHouseholdSize(payload.metadata.householdSize);
        }
    }, [payload.metadata]);

    const handleSubmit = async () => {
        if (householdSize == null) {
            showSnackbar('error', 'Please add a valid household size');
            return;
        }

        if (payload.metadata !== undefined) {
            alert('Edit metadata not implemented yet');
            return;
        }

        const metadataCreate: MetadataCreateDto = {
            householdSize,
            location,
            validFrom,
        };

        try {
            await addMetadata(payload.smartMeterId, metadataCreate);
            showSnackbar('success', 'Successfully added metadata!');
            payload.reloadSmartMeter();
            void onClose();
        } catch (error) {
            showSnackbar('error', 'Add metadata failed!');
            console.error('Add metadata failed:', error);
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
