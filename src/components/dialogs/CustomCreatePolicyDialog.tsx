import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormLabel,
    Input,
    NativeSelect,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { LocationResolution, MeasurementResolution, PolicyCreateDto } from '../../api/openAPI';
import { usePolicyService } from '../../hooks/services/usePolicyService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { DialogProps } from '@toolpad/core';

interface CreatePolicyDialogPayload {
    smartMeterId: string;
}

const CustomCreatePolicyDialog = ({ payload, open, onClose }: Readonly<DialogProps<CreatePolicyDialogPayload>>) => {
    const [policyName, setPolicyName] = useState<string>('');
    const [policyNameError, setPolicyNameError] = useState(false);
    const [policyNameErrorMessage, setPolicyNameErrorMessage] = useState('');

    const { createPolicy } = usePolicyService();
    const { showSnackbar } = useSnackbar();

    const validatePolicyName = (): boolean => {
        if (!policyName.trim()) {
            setPolicyNameError(true);
            setPolicyNameErrorMessage('Smart meter name is required.');
            return false;
        }

        setPolicyNameError(false);
        setPolicyNameErrorMessage('');
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valid = validatePolicyName();
        if (!valid) {
            return;
        }

        const data = new FormData(event.currentTarget);

        const policyCreateDto: PolicyCreateDto = {
            name: policyName,
            measurementResolution: data.get('measurementResolution') as MeasurementResolution,
            locationResolution: data.get('locationResolution') as LocationResolution,
            price: data.get('price') as unknown as number,
            smartMeterId: payload.smartMeterId,
        };

        try {
            await createPolicy(policyCreateDto);
            showSnackbar('success', 'Successfully created policy!');

            void onClose();
        } catch (error) {
            showSnackbar('error', 'Create policy failed!');
            console.error('Create policy failed:', error);
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Create Policy</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={(event) => {
                        void handleSubmit(event);
                    }}
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    <FormControl fullWidth>
                        <TextField
                            value={policyName}
                            onChange={(e) => {
                                setPolicyName(e.target.value);
                            }}
                            id="smartMeterName"
                            placeholder="Enter Smart Meter Name"
                            name="smartMeterName"
                            color={policyNameError ? 'error' : 'primary'}
                            error={policyNameError}
                            helperText={policyNameErrorMessage}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="measurementResolution">Select a Measurement Resolution</FormLabel>
                        <NativeSelect
                            required
                            id="measurementResolution"
                            name="measurementResolution"
                            defaultValue={MeasurementResolution.Raw}>
                            <option aria-label="Raw" value={MeasurementResolution.Raw}>
                                Raw
                            </option>
                            <option aria-label="Minute" value={MeasurementResolution.Minute}>
                                Minute
                            </option>
                            <option aria-label="Quarter Hour" value={MeasurementResolution.QuarterHour}>
                                Quarter Hour
                            </option>
                            <option aria-label="Hour" value={MeasurementResolution.Hour}>
                                Hour
                            </option>
                            <option aria-label="Day" value={MeasurementResolution.Day}>
                                Day
                            </option>
                            <option aria-label="Week" value={MeasurementResolution.Week}>
                                Week
                            </option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="locationResolution">Select a Location Resolution</FormLabel>
                        <NativeSelect
                            required
                            id="locationResolution"
                            name="locationResolution"
                            defaultValue={LocationResolution.None}>
                            <option aria-label="None" value={LocationResolution.None}>
                                None
                            </option>
                            <option aria-label="Street name" value={LocationResolution.StreetName}>
                                Street name
                            </option>
                            <option aria-label="City" value={LocationResolution.City}>
                                City
                            </option>
                            <option aria-label="State" value={LocationResolution.State}>
                                State
                            </option>
                            <option aria-label="Country" value={LocationResolution.Country}>
                                Country
                            </option>
                            <option aria-label="Continent" value={LocationResolution.Continent}>
                                Continent
                            </option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="price">Enter a price</FormLabel>
                        <Input type="number" defaultValue={0} id="price" name="price" inputProps={{ min: 0 }} />
                    </FormControl>
                    <DialogActions>
                        <Button type="submit" variant="outlined">
                            Ok
                        </Button>
                        <Button
                            onClick={() => {
                                void onClose();
                            }}
                            variant="outlined">
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CustomCreatePolicyDialog;
