import React from 'react';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import AppTheme from './themes/AppTheme.tsx';
import { SnackbarProvider } from './components/provider/SnackbarProvider.tsx';
import { ApiProvider } from './components/provider/ApiProvider.tsx';

const Root = (): React.ReactElement => {
    return (
        <AppTheme>
            <CssBaseline />
            <ApiProvider>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </ApiProvider>
        </AppTheme>
    );
};

export default Root;
