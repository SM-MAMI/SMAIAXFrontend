import { useCallback, useContext } from 'react';
import { ApiContext } from '../../components/context/ApiContext.tsx';
import { PolicyCreateDto, ProblemDetails } from '../../api/openAPI';
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

    return {
        createPolicy,
    };
};
