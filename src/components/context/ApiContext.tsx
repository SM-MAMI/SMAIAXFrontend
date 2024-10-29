import React from 'react';
import { AuthenticationApi } from '../../api/openAPI';

interface ApiContextType {
    authenticationApi: AuthenticationApi,
}

export const ApiContext = React.createContext<ApiContextType | null>(null);