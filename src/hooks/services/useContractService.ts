import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import {
    ContractCreateDto,
    ContractDto,
    ContractOverviewDto,
    MeasurementListDto,
    MeasurementResolution,
    ProblemDetails,
} from '../../api/openAPI';
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

    const getContracts = useCallback(async (): Promise<ContractOverviewDto[]> => {
        try {
            const response = await contractApi.getContracts();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ProblemDetails>;
            const errorMessage = axiosError.response?.data.title ?? axiosError.message;
            throw new Error(errorMessage);
        }
    }, [contractApi]);

    const getContract = useCallback(
        async (id: string): Promise<ContractDto> => {
            try {
                const response = await contractApi.getContractById(id);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [contractApi]
    );

    const getContractMeasurements = useCallback(
        async (
            contractId: string,
            measurementResolution?: MeasurementResolution,
            startAt?: string,
            endAt?: string
        ): Promise<MeasurementListDto> => {
            try {
                const response = await contractApi.getMeasurementsByContractId(
                    contractId,
                    measurementResolution,
                    startAt,
                    endAt
                );
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage =
                    axiosError.response?.data.detail ?? axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [contractApi]
    );

    return {
        createContract,
        getContracts,
        getContract,
        getContractMeasurements,
    };
};
