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
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';

const CustomAddSmartMeterDialog = ({ open, onClose }: Readonly<DialogProps>) => {
    const { showSnackbar } = useSnackbar();
    const { addSmartMeter } = useSmartMeterService();

    const [activeStep, setActiveStep] = useState(0);
    const [smartMeterName, setSmartMeterName] = useState<string>(''); // State to persist smart meter name
    const [smartMeterNameError, setSmartMeterNameError] = useState(false);
    const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] = useState('');

    const steps: StepItem[] = [
        {
            title: 'Step 1: Enter Smart Meter Name',
            content: (
                <FormControl fullWidth>
                    <TextField
                        value={smartMeterName}
                        onChange={(e) => {
                            setSmartMeterName(e.target.value);
                        }}
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
            content: (
                <>
                    <Box marginBottom={2}>
                        <Typography>Review all the details and confirm the creation of the Smart Meter.</Typography>
                    </Box>
                    <Typography>
                        <strong>Smart Meter Name:</strong> {smartMeterName}
                    </Typography>
                </>
            ),
        },
    ];

    const validateSmartMeterName = (): boolean => {
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
            const valid = validateSmartMeterName();
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
        const valid = validateSmartMeterName();
        if (!valid) return;

        const smartMeterDto: SmartMeterCreateDto = {
            name: smartMeterName,
        };

        try {
            await addSmartMeter(smartMeterDto);
            showSnackbar('success', 'Successfully added smart meter!');
            setActiveStep(0);
            setSmartMeterName('');
            await onClose();
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to add smart meter!');
        }
    };

    return (
        <Dialog
            fullWidth
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    width: '30%',
                    maxWidth: '1000px',
                    height: '30%',
                    maxHeight: '90vh',
                },
            }}>
            <DialogTitle>Add Smart Meter</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', p: 2 }}>
                    <CustomStepper
                        steps={steps}
                        orientation="horizontal"
                        activeStep={activeStep}
                        onNext={handleNext}
                        onBack={handleBack}
                        onFinish={() => {
                            void handleSubmit();
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        void onClose();
                    }}
                    variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomAddSmartMeterDialog;
