import ColorModeSelect from '../themes/ColorModeSelect.tsx';
import Button from '@mui/material/Button';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { useSnackbar } from '../hooks/useSnackbar.ts';
import { TokenDto } from '../api/openAPI';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { refresh } = useAuthenticationService();

    const navigate = useNavigate();

    const { showSnackbar } = useSnackbar();

    const handleButtonClick = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const accessToken = localStorage.getItem('access_token');

            if (!refreshToken || !accessToken) {
                navigate('/signin');
                return;
            }

            const tokenDto: TokenDto = {
                accessToken: accessToken,
                refreshToken: refreshToken,
            };

            const newTokenDto = await refresh(tokenDto);

            localStorage.setItem('access_token', newTokenDto.accessToken);
            localStorage.setItem('refresh_token', newTokenDto.refreshToken);

            showSnackbar('success', 'Successfully refreshed tokens!');
            console.log(newTokenDto);
        } catch (error) {
            console.log(error);
            showSnackbar('error', `Refresh failed!`);
            navigate('/signin');
        }
    };

    return (
        <>
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    void handleButtonClick();
                }}
                sx={{ marginTop: '1rem' }}
            >
                Refresh token test
            </Button>
        </>
    );
};

export default HomePage;