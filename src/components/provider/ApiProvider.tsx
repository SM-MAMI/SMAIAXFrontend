import { ReactNode } from 'react';
import { AuthenticationApi, SmartMeterApi, UserApi } from '../../api/openAPI';
import { ApiContext } from '../context/ApiContext.tsx';
import { createCustomAxiosInstance } from '../../api/axiosInstance.ts';

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
    const authenticationApi = new AuthenticationApi();
    const axiosInstance = createCustomAxiosInstance(authenticationApi);
    const smartMeterApi = new SmartMeterApi(undefined, undefined, axiosInstance);
    const userApi = new UserApi(undefined, undefined, axiosInstance);

    return <ApiContext.Provider value={{ authenticationApi, smartMeterApi, userApi }}>{children}</ApiContext.Provider>;
};

export { ApiContext };
