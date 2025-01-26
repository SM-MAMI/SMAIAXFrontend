import React from 'react';
import { Dialog, DialogProps, useMediaQuery } from '@mui/material';
import { MediaQueryTabletMaxWidthStr } from '../../constants/constants.ts';

const CustomDialog: React.FC<DialogProps> = ({ children, ...props }) => {
    const isSmallScreen = useMediaQuery(MediaQueryTabletMaxWidthStr);

    return (
        <Dialog
            fullWidth
            {...props}
            sx={{
                '& .MuiDialog-paper': {
                    maxWidth: '1000px',
                    minWidth: isSmallScreen ? '100%' : '600px',
                    height: '30%',
                    maxHeight: '90vh',
                    minHeight: '500px',
                },
            }}>
            {children}
        </Dialog>
    );
};

export default CustomDialog;
