import { useState } from 'react';
import { Box, FormControl, Input, TextField, Typography, useMediaQuery } from '@mui/material';
import CustomStepper, { StepItem } from '../pure/CustomStepper.tsx';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService';
import { LocationDto, SmartMeterAssignDto } from '../../api/openAPI';
import { useSnackbar } from '../../hooks/useSnackbar';
import { DialogProps } from '@toolpad/core';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CreateEditMetadataForm from '../smartMeter/CreateEditMetadataForm.tsx';
import dayjs from 'dayjs';
import { MediaQueryTabletMaxWidthStr } from '../../constants/constants.ts';
import CustomDialog from '../pure/CustomDialog.tsx';
import CustomDialogActions from '../pure/CustomDialogActions.tsx';
import CustomDialogContent from '../pure/CustomDialogContent.tsx';

interface AddSmartMeterDialogPayload {
    reloadSmartMeters: (smartMeterName: string) => void;
    isSmartMeterNameUnique: (smartMeterName: string) => boolean;
}

const INITIAL_LOCATION = {};
const INITIAL_VALID_FROM = dayjs().toISOString();
const INITIAL_HOUSEHOLD_SIZE = undefined;

const AddSmartMeterDialog = ({ payload, open, onClose }: Readonly<DialogProps<AddSmartMeterDialogPayload>>) => {
    const [activeStep, setActiveStep] = useState(0);
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [serialNumberError, setSerialNumberError] = useState(false);
    const [serialNumberErrorMessage, setSerialNumberErrorMessage] = useState('');
    const [smartMeterName, setSmartMeterName] = useState<string>('');
    const [smartMeterNameError, setSmartMeterNameError] = useState(false);
    const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] = useState('');
    const [location, setLocation] = useState<LocationDto>(INITIAL_LOCATION);
    const [validFrom, setValidFrom] = useState(INITIAL_VALID_FROM);
    const [householdSize, setHouseholdSize] = useState<number | undefined>(INITIAL_HOUSEHOLD_SIZE);

    const { showSnackbar } = useSnackbar();
    const { addSmartMeter } = useSmartMeterService();
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);

    const isValidMetadataState =
        (JSON.stringify(location) !== JSON.stringify(INITIAL_LOCATION) ||
            validFrom !== INITIAL_VALID_FROM ||
            householdSize !== INITIAL_HOUSEHOLD_SIZE) &&
        householdSize != undefined;

    const areMetadataEmpty =
        JSON.stringify(location) === JSON.stringify(INITIAL_LOCATION) &&
        validFrom === INITIAL_VALID_FROM &&
        householdSize === INITIAL_HOUSEHOLD_SIZE;

    const steps: StepItem[] = [
        {
            title: 'Step 1: Enter Connector Serial number *',
            content: (
                <FormControl fullWidth>
                    <TextField
                        value={serialNumber}
                        onChange={(e) => {
                            setSerialNumber(e.target.value);
                        }}
                        id="serialNumber"
                        placeholder="Enter Connector Serial number"
                        name="serialNumber"
                        color={serialNumberError ? 'error' : 'primary'}
                        error={serialNumberError}
                        helperText={serialNumberErrorMessage}
                    />
                </FormControl>
            ),
        },
        {
            title: 'Step 2: Enter Smart Meter Name *',
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
            title: 'Step 3: Add Metadata',
            content: (
                <CreateEditMetadataForm
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
            title: 'Step 4: Review & Confirm',
            content: (
                <>
                    <Box marginBottom={2}>
                        <Typography>Review all the details and confirm the creation of the Smart Meter.</Typography>
                    </Box>

                    <Typography>
                        <strong>Smart Meter Name:</strong> {smartMeterName}
                    </Typography>

                    {!areMetadataEmpty && (
                        <>
                            <Typography>
                                <strong>Household Size:</strong> {householdSize}
                            </Typography>
                            <Typography>
                                <strong>Valid From:</strong> {dayjs(validFrom).format('YYYY-MM-DD')}
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
                            {householdSize == undefined && (
                                <Input
                                    error
                                    fullWidth
                                    value="Metadata can not be added without a household size."
                                    readOnly
                                />
                            )}
                        </>
                    )}
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

        if (!payload.isSmartMeterNameUnique(smartMeterName)) {
            setSmartMeterNameError(true);
            setSmartMeterNameErrorMessage('Smart Meter Name must be unique.');
            return false;
        }

        setSmartMeterNameError(false);
        setSmartMeterNameErrorMessage('');
        return true;
    };

    const validateSerialNumber = (): boolean => {
        if (!serialNumber.trim()) {
            setSerialNumberError(true);
            setSerialNumberErrorMessage('Serial number is required.');
            return false;
        }

        setSerialNumberError(false);
        setSerialNumberErrorMessage('');
        return true;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            const valid = validateSerialNumber();
            if (!valid) {
                return;
            }
        }

        if (activeStep === 1) {
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
        const valid = validateSerialNumber() && validateSmartMeterName();
        if (!valid) {
            return;
        }

        const smartMeterDto: SmartMeterAssignDto = {
            serialNumber: serialNumber,
            name: smartMeterName,
        };

        if (isValidMetadataState) {
            smartMeterDto.metadata = {
                householdSize,
                location,
                validFrom,
            };
        }

        try {
            await addSmartMeter(smartMeterDto);
            showSnackbar('success', 'Successfully added smart meter!');
            setActiveStep(0);
            setSmartMeterName('');

            payload.reloadSmartMeters(smartMeterName);

            await onClose();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                if (error.message !== 'Something went wrong.') {
                    showSnackbar('error', error.message);
                    return;
                }
            }

            showSnackbar('error', 'Failed to add smart meter!');
        }
    };

    return (
        <CustomDialog open={open}>
            <DialogTitle>Add Existing Smart Meter</DialogTitle>
            <CustomDialogContent>
                <CustomStepper
                    steps={steps}
                    orientation={isSmallScreen ? 'vertical' : 'horizontal'}
                    activeStep={activeStep}
                />
            </CustomDialogContent>
            <CustomDialogActions justifyContent={'space-between'}>
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
            </CustomDialogActions>
        </CustomDialog>
    );
};

export default AddSmartMeterDialog;
