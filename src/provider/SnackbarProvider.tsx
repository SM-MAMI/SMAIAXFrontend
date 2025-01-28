import { Alert, AlertColor, Snackbar } from '@mui/material';
import { ReactNode, useState } from 'react';
import { SnackbarContext } from './context/SnackbarContext.tsx';

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [snackbarKey, setSnackbarKey] = useState(0);

    const showSnackbar = (severity: AlertColor, message: string) => {
        setSeverity(severity);
        setMessage(message);
        setSnackbarKey((prevKey) => prevKey + 1);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext value={{ showSnackbar }}>
            {children}
            <Snackbar
                key={snackbarKey}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext>
    );
};
