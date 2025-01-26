import React from 'react';
import { Box, DialogContent, DialogContentProps } from '@mui/material';

const CustomDialogContent: React.FC<DialogContentProps> = ({ children, ...props }) => {
    return (
        <DialogContent {...props}>
            <Box sx={{ width: '100%', p: 2 }}>{children}</Box>
        </DialogContent>
    );
};

export default CustomDialogContent;
