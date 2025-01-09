import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { ContractCreateDto, ProblemDetails } from '../../api/openAPI';
import { AxiosError } from 'axios';

export const useContractService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useContractService must be used within an ApiContextProvider');
    }

    const { contractApi } = context;

    const createContract = useCallback(
        async (contractCreateDto: ContractCreateDto): Promise<string> => {
            try {
                const response = await contractApi.createContract(contractCreateDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [contractApi]
    );

    return {
        createContract,
    };
};
