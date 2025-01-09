import React from 'react';
import {
    DeviceConfigApi,
    AuthenticationApi,
    OrderApi,
    PolicyApi,
    SmartMeterApi,
    MeasurementApi,
    ContractApi,
} from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi;
    smartMeterApi: SmartMeterApi;
    policyApi: PolicyApi;
    orderApi: OrderApi;
    measurementApi: MeasurementApi;
    deviceConfigApi: DeviceConfigApi;
    contractApi: ContractApi;
}

export const ApiContext = React.createContext<ApiContextType | null>(null);
