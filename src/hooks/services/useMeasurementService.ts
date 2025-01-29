import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { MeasurementListDto, MeasurementResolution, ProblemDetails } from '../../api/openAPI';
import { AxiosError } from 'axios';
import { getErrorDetails } from '../../utils/helper.ts';

export const useMeasurementService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useMeasurementService must be used within an ApiContextProvider');
    }

    const { measurementApi } = context;

    const getMeasurements = useCallback(
        async (
            smartMeterId: string,
            measurementResolution?: MeasurementResolution,
            startAt?: string,
            endAt?: string
        ): Promise<MeasurementListDto> => {
            try {
                const response = await measurementApi.getMeasurements(
                    smartMeterId,
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
        [measurementApi]
    );

    return {
        getMeasurements,
    };
};
