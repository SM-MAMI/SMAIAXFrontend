import { createContext, useContext } from 'react';
import { AlertColor } from '@mui/material';

interface SnackbarContextType {
    showSnackbar: (severity: AlertColor, message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }

    return context;
};