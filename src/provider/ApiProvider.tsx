import { ReactNode } from 'react';
import {
    AuthenticationApi,
    ContractApi,
    DeviceConfigApi,
    MeasurementApi,
    OrderApi,
    PolicyApi,
    SmartMeterApi,
} from '../api/openAPI';
import { ApiContext } from './context/ApiContext.tsx';
import { createCustomAxiosInstance } from '../api/axiosInstance.ts';

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
    const authenticationApi = new AuthenticationApi();
    const axiosInstance = createCustomAxiosInstance(authenticationApi);
    const smartMeterApi = new SmartMeterApi(undefined, undefined, axiosInstance);
    const policyApi = new PolicyApi(undefined, undefined, axiosInstance);
    const orderApi = new OrderApi(undefined, undefined, axiosInstance);
    const measurementApi = new MeasurementApi(undefined, undefined, axiosInstance);
    const deviceConfigApi = new DeviceConfigApi(undefined, undefined, axiosInstance);
    const contractApi = new ContractApi(undefined, undefined, axiosInstance);

    return (
        <ApiContext
            value={{
                authenticationApi,
                smartMeterApi,
                policyApi,
                orderApi,
                measurementApi,
                deviceConfigApi,
                contractApi,
            }}>
            {children}
        </ApiContext>
    );
};

export { ApiContext };
