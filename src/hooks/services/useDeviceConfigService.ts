import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { AxiosError } from 'axios';
import { DeviceConfigDto, ProblemDetails } from '../../api/openAPI';

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
                const errorMessage = axiosError.response?.data.title ?? axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [deviceConfigApi]
    );

    return {
        getDeviceConfig,
    };
};
