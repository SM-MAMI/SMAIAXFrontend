import { ReactNode } from 'react';
import { AuthenticationApi } from '../../api/openAPI';
import { ApiContext } from '../context/ApiContext.tsx';

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
    const authenticationApi = new AuthenticationApi();

    // const { refresh } = useAuthenticationService();
    // const axiosInstance = createAxiosInstance(refresh);
    //
    // const config = new Configuration({
    //     basePath: BASE_PATH, // Your API base URL
    //     baseOptions: {
    //         axiosInstance,
    //     },
    // });
    //
    // const smartMeterApi = new AuthenticationApi(config);

    return (
        <ApiContext.Provider value={{ authenticationApi }}>
            {children}
        </ApiContext.Provider>
    );
};

export { ApiContext };