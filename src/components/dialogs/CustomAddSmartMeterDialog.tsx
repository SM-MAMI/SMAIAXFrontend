import { useState } from 'react';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import CustomStepper, { StepItem } from './../CustomStepper';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import { SmartMeterCreateDto } from '../../api/openAPI';
import { useSnackbar } from '../../hooks/useSnackbar';
import { DialogProps } from '@toolpad/core';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

const CustomAddSmartMeterDialog = ({ open, onClose }: Readonly<DialogProps>) => {
    const { showSnackbar } = useSnackbar();
    const { addSmartMeter } = useSmartMeterService();

    const [activeStep, setActiveStep] = useState(0);
    const [smartMeterNameError, setSmartMeterNameError] = useState(false);
    const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] = useState('');

    const steps: StepItem[] = [
        {
            title: 'Step 1: Enter Smart Meter Name',
            content: (
                <FormControl fullWidth>
                    <TextField
                        id="smartMeterName"
                        placeholder="Enter Smart Meter Name"
                        name="smartMeterName"
                        color={smartMeterNameError ? 'error' : 'primary'}
                        error={smartMeterNameError}
                        helperText={smartMeterNameErrorMessage}
                    />
                </FormControl>
            ),
        },
        {
            title: 'Step 2: Add Metadata',
            content: <Typography>Add Metadata</Typography>,
        },
        {
            title: 'Step 3: Review & Confirm',
            content: <Typography>Review all the details and confirm the creation of the Smart Meter.</Typography>,
        },
    ];

    const validateSmartMeterName = (smartMeterName: string): boolean => {
        if (!smartMeterName.trim()) {
            setSmartMeterNameError(true);
            setSmartMeterNameErrorMessage('Smart meter name is required.');
            return false;
        }

        setSmartMeterNameError(false);
        setSmartMeterNameErrorMessage('');
        return true;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            const smartMeterName = (document.getElementById('smartMeterName') as HTMLInputElement).value;
            const valid = validateSmartMeterName(smartMeterName);
            if (!valid) {
                return;
            }
        }

        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        const smartMeterName = (document.getElementById('smartMeterName') as HTMLInputElement).value;

        const valid = validateSmartMeterName(smartMeterName);
        if (!valid) return;

        const smartMeterDto: SmartMeterCreateDto = {
            name: smartMeterName,
        };

        try {
            await addSmartMeter(smartMeterDto);
            showSnackbar('success', 'Successfully added smart meter!');
            setActiveStep(0);
            await onClose();
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to add smart meter!');
        }
    };

    return (
        <Dialog fullWidth open={open}>
            <DialogTitle>Device Configuration</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', p: 2 }}>
                    <CustomStepper
                        steps={steps}
                        orientation="horizontal"
                        activeStep={activeStep}
                        onNext={handleNext}
                        onBack={handleBack}
                        onReset={() => {
                            void handleSubmit();
                        }}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CustomAddSmartMeterDialog;
