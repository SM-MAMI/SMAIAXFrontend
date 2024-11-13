import { useCallback, useContext } from 'react';
import { ApiContext } from '../../components/context/ApiContext.tsx';
import { ProblemDetails, SmartMeterCreateDto, SmartMeterOverviewDto } from '../../api/openAPI';
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
        async (id: string): Promise<SmartMeterOverviewDto> => {
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
        getSmartMeters,
        getSmartMeter,
    };
};
