import { PageContainer } from '@toolpad/core/PageContainer';
import React, { useEffect, useState } from 'react';
import { ContractCreateDto, MeasurementResolution, PolicyDto } from '../../api/openAPI';
import { usePolicyService } from '../../hooks/services/usePolicyService.ts';
import {
    Box,
    Button,
    CircularProgress,
    DialogActions,
    FormLabel,
    Input,
    NativeSelect,
    Typography,
} from '@mui/material';
import SmartMeterPoliciesTable from '../../components/tables/SmartMeterPoliciesTable.tsx';
import FormControl from '@mui/material/FormControl';
import { useContractService } from '../../hooks/services/useContractService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';

const PolicySearchPage = () => {
    const [policies, setPolicies] = useState<PolicyDto[] | undefined>(undefined);

    const { searchPolicies } = usePolicyService();
    const { createContract } = useContractService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        void loadPolicies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPolicies = async (maxPrice?: number, measurementResolution?: MeasurementResolution) => {
        try {
            const policies = await searchPolicies(maxPrice, measurementResolution);
            setPolicies(policies);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let measurementResolution = data.get('measurementResolution') as MeasurementResolution | undefined;
        let price = data.get('price') as unknown as number | undefined;

        if (!measurementResolution) {
            measurementResolution = undefined;
        }

        if (!price) {
            price = undefined;
        }

        void loadPolicies(price, measurementResolution);
    };

    const handleReset = () => {
        void loadPolicies();
    };

    const handlePurchase = (policyId: string) => {
        try {
            const contractCreateDto: ContractCreateDto = {
                policyId: policyId,
            };

            void createContract(contractCreateDto);
            showSnackbar('success', 'Successfully purchased data.');
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to purchase data.');
        }
    };

    return (
        <PageContainer title="">
            <div style={{ marginTop: '20px', width: '100%' }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    <FormControl>
                        <FormLabel htmlFor="measurementResolution">Measurement Resolution</FormLabel>
                        <NativeSelect id="measurementResolution" name="measurementResolution">
                            <option aria-label="None" value=""></option>
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
                        <FormLabel htmlFor="price">Maximum price</FormLabel>
                        <Input type="number" id="price" name="price" inputProps={{ min: 0 }} />
                    </FormControl>
                    <DialogActions>
                        <Button type="submit" variant="outlined">
                            Search
                        </Button>
                        <Button type="reset" variant="outlined">
                            Clear Filters
                        </Button>
                    </DialogActions>
                </Box>
            </div>

            <Typography variant="h5" style={{ marginBottom: '10px' }}>
                Policies
            </Typography>

            {policies ? (
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <SmartMeterPoliciesTable policies={policies} onPurchase={handlePurchase} />
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            )}
        </PageContainer>
    );
};

export default PolicySearchPage;
