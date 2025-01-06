import React from 'react';
import { AuthenticationApi, OrderApi, PolicyApi, SmartMeterApi, MeasurementApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
    policyApi: PolicyApi;
    orderApi: OrderApi;
    measurementApi: MeasurementApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
