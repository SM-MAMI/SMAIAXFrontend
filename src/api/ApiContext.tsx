import React from 'react';
import { AuthenticationApi } from './openAPI';

const authenticationApi = new AuthenticationApi();

interface ApiContextType {
    authenticationApi: AuthenticationApi,
}

export const ApiContext = React.createContext<ApiContextType>({
    authenticationApi,
});