import React from 'react';
import { AuthenticationApi, SmartMeterApi, UserApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
    userApi: UserApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
