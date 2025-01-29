import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import {
    MetadataCreateDto,
    MetadataUpdateDto,
    ProblemDetails,
    SmartMeterAssignDto,
    SmartMeterDto,
    SmartMeterOverviewDto,
    SmartMeterUpdateDto,
} from '../../api/openAPI';
import { AxiosError } from 'axios';
import { getErrorDetails } from '../../utils/helper.ts';

export const useSmartMeterService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useSmartMeterService must be used within an ApiContextProvider');
    }

    const { smartMeterApi } = context;

    const addSmartMeter = useCallback(
        async (smartMeterCreatedDto: SmartMeterAssignDto): Promise<string> => {
            try {
                const response = await smartMeterApi.assignSmartMeter(smartMeterCreatedDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    const addMetadata = useCallback(
        async (smartMeterId: string, metadataCreateDto: MetadataCreateDto): Promise<string> => {
            try {
                const response = await smartMeterApi.addMetadata(smartMeterId, metadataCreateDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    const getSmartMeters = useCallback(async (): Promise<SmartMeterOverviewDto[]> => {
        try {
            const response = await smartMeterApi.getSmartMeters();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ProblemDetails>;
            throw new Error(getErrorDetails(axiosError));
        }
    }, [smartMeterApi]);

    const getSmartMeter = useCallback(
        async (id: string): Promise<SmartMeterDto> => {
            try {
                const response = await smartMeterApi.getSmartMeterById(id);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    const updateMetadata = useCallback(
        async (smartMeterId: string, metadataId: string, updateMetadataDto: MetadataUpdateDto): Promise<string> => {
            try {
                const response = await smartMeterApi.updateMetadata(smartMeterId, metadataId, updateMetadataDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    const updateSmartMeter = useCallback(
        async (smartMeterId: string, updatedSmartMeter: SmartMeterUpdateDto): Promise<string> => {
            try {
                const response = await smartMeterApi.updateSmartMeter(smartMeterId, updatedSmartMeter);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    const removeSmartMeter = useCallback(
        async (smartMeterId: string): Promise<void> => {
            try {
                await smartMeterApi.removeSmartMeter(smartMeterId);
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [smartMeterApi]
    );

    return {
        addSmartMeter,
        addMetadata,
        getSmartMeters,
        getSmartMeter,
        updateMetadata,
        updateSmartMeter,
        removeSmartMeter,
    };
};
