import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
            <Typography>404</Typography>
            <Typography>The page you are looking for does not exist.</Typography>
        </Box>
    );
};

export default NotFoundPage;
