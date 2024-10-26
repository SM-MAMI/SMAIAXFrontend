import React from 'react';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import AppTheme from './themes/AppTheme.tsx';
import { ApiContext } from './api/ApiContext.tsx';
import { AuthenticationApi } from './api/openAPI';
import {SnackbarProvider} from "./components/SnackbarProvider.tsx";

const Root = (): React.ReactElement => {
    const authenticationApi = new AuthenticationApi();

    return (
        <AppTheme>
            <CssBaseline />
            <ApiContext.Provider value={{ authenticationApi }}>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </ApiContext.Provider>
        </AppTheme>
    );
};

export default Root;
