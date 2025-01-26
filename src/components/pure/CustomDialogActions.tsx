import React from 'react';
import { DialogActions, DialogActionsProps } from '@mui/material';

interface CustomDialogActionsProps extends DialogActionsProps {
    justifyContent?: string;
}

const CustomDialogActions: React.FC<CustomDialogActionsProps> = ({
    children,
    justifyContent = 'flex-end',
    ...props
}) => {
    return (
        <DialogActions
            sx={{
                justifyContent: justifyContent,
                p: 3,
            }}
            {...props}>
            {children}
        </DialogActions>
    );
};

export default CustomDialogActions;
