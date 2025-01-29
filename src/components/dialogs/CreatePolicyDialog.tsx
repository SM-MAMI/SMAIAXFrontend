import { Box, Button, DialogTitle, FormLabel, Input, NativeSelect, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { LocationResolution, MeasurementResolution, PolicyCreateDto } from '../../api/openAPI';
import { usePolicyService } from '../../hooks/services/usePolicyService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { DialogProps } from '@toolpad/core';
import CustomDialog from '../pure/CustomDialog.tsx';
import CustomDialogActions from '../pure/CustomDialogActions.tsx';
import CustomDialogContent from '../pure/CustomDialogContent.tsx';

interface CreatePolicyDialogPayload {
    smartMeterId: string;
    reloadPolicies: (smartMeterId: string) => void;
}

const CreatePolicyDialog = ({ payload, open, onClose }: Readonly<DialogProps<CreatePolicyDialogPayload>>) => {
    const [policyName, setPolicyName] = useState<string>('');
    const [policyNameError, setPolicyNameError] = useState(false);
    const [policyNameErrorMessage, setPolicyNameErrorMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const { createPolicy } = usePolicyService();
    const { showSnackbar } = useSnackbar();

    const validatePolicyName = (): boolean => {
        if (!policyName.trim()) {
            setPolicyNameError(true);
            setPolicyNameErrorMessage('Policy name is required.');
            return false;
        }

        setPolicyNameError(false);
        setPolicyNameErrorMessage('');
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formRef.current) {
            return;
        }

        const valid = validatePolicyName();
        if (!valid) {
            return;
        }

        const data = new FormData(formRef.current);

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

            payload.reloadPolicies(payload.smartMeterId);

            void onClose();
        } catch (error) {
            showSnackbar('error', 'Create policy failed!');
            console.error('Create policy failed:', error);
        }
    };

    return (
        <CustomDialog open={open}>
            <DialogTitle>Create Policy</DialogTitle>
            <CustomDialogContent>
                <Box
                    component="form"
                    ref={formRef}
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
                            id="policyName"
                            placeholder="Enter Policy Name"
                            name="policyName"
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
                </Box>
            </CustomDialogContent>
            <CustomDialogActions>
                <Button onClick={() => formRef.current?.requestSubmit()} variant="contained">
                    Create
                </Button>
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

export default CreatePolicyDialog;
