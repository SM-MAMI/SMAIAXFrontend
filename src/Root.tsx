import React from 'react';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import AppTheme from './themes/AppTheme.tsx';
import { SnackbarProvider } from './components/provider/SnackbarProvider.tsx';
import { ApiProvider } from './components/provider/ApiProvider.tsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Root = (): React.ReactElement => {
    return (
        <AppTheme>
            <CssBaseline />
            <ApiProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SnackbarProvider>
                        <App />
                    </SnackbarProvider>
                </LocalizationProvider>
            </ApiProvider>
        </AppTheme>
    );
};

export default Root;
