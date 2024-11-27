import { useState } from 'react';
import { Box, FormControl, TextField, Typography, useMediaQuery } from '@mui/material';
import CustomStepper, { StepItem } from './../CustomStepper';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import { LocationDto, MetadataCreateDto, SmartMeterCreateDto } from '../../api/openAPI';
import { useSnackbar } from '../../hooks/useSnackbar';
import { DialogProps } from '@toolpad/core';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import CustomEditMetadataForm from '../CustomEditMetadataForm.tsx';
import dayjs from 'dayjs';

const CustomAddSmartMeterDialog = ({ open, onClose }: Readonly<DialogProps>) => {
    const [activeStep, setActiveStep] = useState(0);
    const [smartMeterName, setSmartMeterName] = useState<string>('');
    const [smartMeterNameError, setSmartMeterNameError] = useState(false);
    const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] = useState('');
    const [location, setLocation] = useState<LocationDto>({});
    const [validFrom, setValidFrom] = useState(dayjs().toISOString());
    const [householdSize, setHouseholdSize] = useState<number>(0);

    const { showSnackbar } = useSnackbar();
    const { addSmartMeter } = useSmartMeterService();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

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
            content: (
                <CustomEditMetadataForm
                    location={location}
                    setLocation={setLocation}
                    householdSize={householdSize}
                    setHouseholdSize={setHouseholdSize}
                    validFrom={validFrom}
                    setValidFrom={setValidFrom}
                />
            ),
            optional: true,
        },
        {
            title: 'Step 3: Review & Confirm',
            content: (
                <>
                    <Box marginBottom={2}>
                        <Typography>Review all the details and confirm the creation of the Smart Meter.</Typography>
                    </Box>
                    <Typography>
                        <strong>Smart Meter Name:</strong> {smartMeterName ?? 'N/A'}
                    </Typography>
                    <Typography>
                        <strong>Household Size:</strong> {householdSize ?? 'N/A'}
                    </Typography>
                    <Typography>
                        <strong>Valid From:</strong> {dayjs(validFrom).format('YYYY-MM-DD') ?? 'N/A'}
                    </Typography>
                    <Typography>
                        <strong>Location:</strong>
                        <ul>
                            <li>
                                <strong>Continent:</strong> {location.continent ?? 'N/A'}
                            </li>
                            <li>
                                <strong>Country:</strong> {location.country ?? 'N/A'}
                            </li>
                            <li>
                                <strong>State:</strong> {location.state ?? 'N/A'}
                            </li>
                            <li>
                                <strong>City:</strong> {location.city ?? 'N/A'}
                            </li>
                            <li>
                                <strong>Street Name:</strong> {location.streetName ?? 'N/A'}
                            </li>
                        </ul>
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

        const metadataCreate: MetadataCreateDto = {
            householdSize,
            location,
            validFrom,
        };

        const smartMeterDto: SmartMeterCreateDto = {
            name: smartMeterName,
            metadata: metadataCreate,
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

    const minWidth = isSmallScreen ? '100%' : '600px';
    return (
        <Dialog
            fullWidth
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    width: '50%',
                    maxWidth: '1000px',
                    minWidth: minWidth,
                    height: '30%',
                    maxHeight: '90vh',
                    minHeight: '500px',
                },
            }}>
            <DialogTitle>Add Smart Meter</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', p: 2 }}>
                    <CustomStepper
                        steps={steps}
                        orientation={isSmallScreen ? 'vertical' : 'horizontal'}
                        activeStep={activeStep}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
                <Box>
                    <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined" sx={{ mr: 2 }}>
                        Back
                    </Button>
                    {activeStep < steps.length - 1 ? (
                        <Button onClick={handleNext} variant="contained">
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                void handleSubmit();
                            }}
                            variant="contained">
                            Finish
                        </Button>
                    )}
                </Box>
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
