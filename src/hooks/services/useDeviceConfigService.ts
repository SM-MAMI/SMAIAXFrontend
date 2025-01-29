import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { AxiosError } from 'axios';
import { DeviceConfigDto, ProblemDetails } from '../../api/openAPI';
import { getErrorDetails } from '../../utils/helper.ts';

export const useDeviceConfigService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useDeviceConfigService must be used within an ApiContextProvider');
    }

    const { deviceConfigApi } = context;

    const getDeviceConfig = useCallback(
        async (deviceId: string): Promise<DeviceConfigDto> => {
            try {
                const response = await deviceConfigApi.getDeviceConfig(deviceId);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [deviceConfigApi]
    );

    return {
        getDeviceConfig,
    };
};
