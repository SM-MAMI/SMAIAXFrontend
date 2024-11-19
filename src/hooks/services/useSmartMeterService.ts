import { useCallback, useContext } from 'react';
import { ApiContext } from '../../components/context/ApiContext.tsx';
import {
    MetadataCreateDto,
    ProblemDetails,
    SmartMeterCreateDto,
    SmartMeterDto,
    SmartMeterOverviewDto,
} from '../../api/openAPI';
import { AxiosError } from 'axios';

export const useSmartMeterService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useSmartMeterService must be used within an ApiContextProvider');
    }

    const { smartMeterApi } = context;

    const addSmartMeter = useCallback(
        async (smartMeterCreatedDto: SmartMeterCreateDto): Promise<string> => {
            try {
                const response = await smartMeterApi.addSmartMeter(smartMeterCreatedDto);

                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
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
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
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
            const errorMessage = axiosError.response?.data.title ?? axiosError.message;
            throw new Error(errorMessage);
        }
    }, [smartMeterApi]);

    const getSmartMeter = useCallback(
        async (id: string): Promise<SmartMeterDto> => {
            try {
                const response = await smartMeterApi.getSmartMeterById(id);

                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [smartMeterApi]
    );

    return {
        addSmartMeter,
        addMetadata,
        getSmartMeters,
        getSmartMeter,
    };
};
