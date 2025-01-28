import DialogTitle from '@mui/material/DialogTitle';
import CustomDialogActions from '../pure/CustomDialogActions.tsx';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { DialogProps } from '@toolpad/core';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import CustomDialog from '../pure/CustomDialog.tsx';
import CustomDialogContent from '../pure/CustomDialogContent.tsx';
import { SmartMeterUpdateDto } from '../../api/openAPI';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

interface EditSmartMeterDialogPayload {
    reloadSmartMeters: () => void;
    smartMeterUpdateDto: SmartMeterUpdateDto;
}

const EditSmartMeterDialog = ({ payload, open, onClose }: Readonly<DialogProps<EditSmartMeterDialogPayload>>) => {
    const [smartMeterName, setSmartMeterName] = useState(payload.smartMeterUpdateDto.name);

    const { updateSmartMeter } = useSmartMeterService();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        try {
            const updatedSmartMeter: SmartMeterUpdateDto = {
                id: payload.smartMeterUpdateDto.id,
                name: smartMeterName,
            };

            await updateSmartMeter(updatedSmartMeter.id, updatedSmartMeter);
            showSnackbar('success', 'Successfully updated smart meter!');
            payload.reloadSmartMeters();
            await onClose();
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to update smart meter!');
        }
    };

    function onSmartMeterNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSmartMeterName(e.target.value);
    }

    return (
        <CustomDialog open={open}>
            <DialogTitle>Edit Smart Meter</DialogTitle>
            <CustomDialogContent>
                <TextField
                    label="Enter Smart Meter Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={smartMeterName}
                    onChange={onSmartMeterNameChange}
                />
            </CustomDialogContent>
            <CustomDialogActions>
                <Box>
                    <Button
                        onClick={() => {
                            void handleSubmit();
                        }}
                        variant="contained">
                        Save
                    </Button>
                </Box>
                <Button
                    onClick={() => {
                        void onClose();
                    }}
                    variant="outlined">
                    Cancel
                </Button>
            </CustomDialogActions>
        </CustomDialog>
    );
};

export default EditSmartMeterDialog;
