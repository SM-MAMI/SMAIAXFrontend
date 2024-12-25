import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { AxiosError } from 'axios';
import { ProblemDetails } from '../../api/openAPI';

export const useOrderService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useOrderService must be used within an ApiContextProvider');
    }

    const { orderApi } = context;

    const orderSmartMeterConnector = useCallback(async (): Promise<string> => {
        try {
            const response = await orderApi.orderSmartMeterConnector();
            return response.data.serialNumber;
        } catch (error) {
            const axiosError = error as AxiosError<ProblemDetails>;
            const errorMessage = axiosError.response?.data.title ?? axiosError.message;
            throw new Error(errorMessage);
        }
    }, [orderApi]);

    return {
        orderSmartMeterConnector,
    };
};
