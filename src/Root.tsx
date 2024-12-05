import React from 'react';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import AppTheme from './themes/AppTheme.tsx';
import { SnackbarProvider } from './provider/SnackbarProvider.tsx';
import { ApiProvider } from './provider/ApiProvider.tsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DialogsProvider } from '@toolpad/core';

const Root = (): React.ReactElement => {
    return (
        <AppTheme>
            <CssBaseline />
            <ApiProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DialogsProvider>
                        <SnackbarProvider>
                            <App />
                        </SnackbarProvider>
                    </DialogsProvider>
                </LocalizationProvider>
            </ApiProvider>
        </AppTheme>
    );
};

export default Root;
