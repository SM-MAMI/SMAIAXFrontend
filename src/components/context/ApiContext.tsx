import React from 'react';
import { AuthenticationApi, PolicyApi, SmartMeterApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
    policyApi: PolicyApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
