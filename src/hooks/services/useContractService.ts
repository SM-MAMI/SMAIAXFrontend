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
import { getErrorDetails } from '../../utils/helper.ts';

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
                throw new Error(getErrorDetails(axiosError));
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
            throw new Error(getErrorDetails(axiosError));
        }
    }, [contractApi]);

    const getContract = useCallback(
        async (id: string): Promise<ContractDto> => {
            try {
                const response = await contractApi.getContractById(id);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
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
                throw new Error(getErrorDetails(axiosError));
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
