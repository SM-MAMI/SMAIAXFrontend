import { ReactNode } from 'react';
import { AuthenticationApi, DeviceConfigApi, MeasurementApi, OrderApi, PolicyApi, SmartMeterApi } from '../api/openAPI';
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

    return (
        <ApiContext.Provider
            value={{ authenticationApi, smartMeterApi, policyApi, orderApi, measurementApi, deviceConfigApi }}>
            {children}
        </ApiContext.Provider>
    );
};

export { ApiContext };
