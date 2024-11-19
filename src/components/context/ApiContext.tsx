import React from 'react';
import { AuthenticationApi, SmartMeterApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
