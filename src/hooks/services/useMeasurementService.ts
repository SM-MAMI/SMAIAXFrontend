import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { MeasurementRawDto, ProblemDetails } from '../../api/openAPI';
import { AxiosError } from 'axios';

export const useMeasurementService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useMeasurementService must be used within an ApiContextProvider');
    }

    const { measurementApi } = context;

    const getMeasurements = useCallback(
        async (smartMeterId: string, startAt: string, endAt: string): Promise<MeasurementRawDto[]> => {
            try {
                const response = await measurementApi.getMeasurements(smartMeterId, startAt, endAt);

                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [measurementApi]
    );

    return {
        getMeasurements,
    };
};
