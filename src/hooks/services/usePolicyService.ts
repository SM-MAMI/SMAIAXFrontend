import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import {
    LocationResolution,
    MeasurementListDto,
    MeasurementResolution,
    PolicyCreateDto,
    PolicyDto,
    ProblemDetails,
} from '../../api/openAPI';
import { AxiosError } from 'axios';

export const usePolicyService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('usePolicyService must be used within an ApiContextProvider');
    }

    const { policyApi } = context;

    const createPolicy = useCallback(
        async (policyCreateDto: PolicyCreateDto): Promise<string> => {
            try {
                const response = await policyApi.createPolicy(policyCreateDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [policyApi]
    );

    const getPoliciesBySmartMeterId = useCallback(
        async (smartMeterId: string): Promise<PolicyDto[]> => {
            try {
                const response = await policyApi.getPolicies(smartMeterId);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [policyApi]
    );

    const searchPolicies = useCallback(
        async (
            maxPrice?: number,
            measurementResolution?: MeasurementResolution,
            locationResolution?: LocationResolution
        ): Promise<PolicyDto[]> => {
            try {
                const response = await policyApi.searchPolicies(maxPrice, measurementResolution, locationResolution);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [policyApi]
    );

    const getPolicyMeasurements = useCallback(
        async (
            policyId: string,
            _measurementResolution?: MeasurementResolution,
            _startAt?: string,
            _endAt?: string
        ): Promise<MeasurementListDto> => {
            try {
                const response = await policyApi.getMeasurementsByPolicy(policyId);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [policyApi]
    );

    return {
        createPolicy,
        getPoliciesBySmartMeterId,
        searchPolicies,
        getPolicyMeasurements,
    };
};
