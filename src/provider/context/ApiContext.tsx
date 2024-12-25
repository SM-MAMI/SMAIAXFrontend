import React from 'react';
import { AuthenticationApi, OrderApi, PolicyApi, SmartMeterApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
    policyApi: PolicyApi;
    orderApi: OrderApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
