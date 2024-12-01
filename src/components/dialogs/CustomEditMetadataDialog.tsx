import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LocationDto, MetadataCreateDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import dayjs from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar';
import { DialogProps } from '@toolpad/core';
import CustomEditMetadataForm from '../CustomEditMetadataForm.tsx';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';

interface EditMetadataDialogPayload {
    smartMeterId: string;
    isNew: boolean;
    reloadSmartMeter: () => void;
}

const CustomEditMetadataDialog = ({ payload, open, onClose }: Readonly<DialogProps<EditMetadataDialogPayload>>) => {
    const [location, setLocation] = useState<LocationDto>({});
    const [validFrom, setValidFrom] = useState(dayjs().toISOString());
    const [householdSize, setHouseholdSize] = useState<number | undefined>(undefined);

    const { addMetadata } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if (householdSize == null) {
            showSnackbar('error', 'Please add a valid household size');
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
            <DialogTitle>{payload.isNew ? 'Add Metadata' : 'Edit Metadata'}</DialogTitle>
            <DialogContent>
                <CustomEditMetadataForm
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

export default CustomEditMetadataDialog;
