import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useValidation } from '../hooks/useValidation.ts';
import { LoginDto } from '../api/openAPI';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { useSnackbar } from '../hooks/useSnackbar.ts';
import { SmaiaxTextAndDotsIcon } from '../assets/SmaiaxTextAndDots.tsx';
import { SmaiaXAbsoluteRoutes } from '../constants/constants.ts';
import CustomPasswordFormControl from '../components/pure/CustomPasswordFormControl.tsx';
import CustomAuthCardContainer from '../components/pure/CustomAuthCardContainer.tsx';
import CustomAuthCard from '../components/pure/CustomAuthCard.tsx';

export default function SignIn() {
    const [password, setPassword] = React.useState('');

    const { emailError, emailErrorMessage, passwordError, passwordErrorMessage } = useValidation();
    const { login } = useAuthenticationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const loginDto: LoginDto = {
            username: data.get('email') as string,
            password: password,
        };

        try {
            const tokenDto = await login(loginDto);

            localStorage.setItem('access_token', tokenDto.accessToken);
            localStorage.setItem('refresh_token', tokenDto.refreshToken);

            showSnackbar('success', 'Successfully signed in!');
            void navigate('/');
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Signin failed!');
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            <CustomAuthCardContainer>
                <CustomAuthCard>
                    <SmaiaxTextAndDotsIcon />

                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            textAlign: 'center',
                        }}>
                        Sign in
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={(event) => {
                            void handleSubmit(event);
                        }}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}>
                        <FormControl>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                type="email"
                                autoFocus
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={emailError ? 'error' : 'primary'}
                                sx={{ ariaLabel: 'email' }}
                                label={'Email / Username'}
                            />
                        </FormControl>
                        <FormControl>
                            <CustomPasswordFormControl
                                password={password}
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                onPasswordChange={handlePasswordChange}
                                label="Password"
                            />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained">
                            Sign in
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ textAlign: 'center', marginRight: 1 }}>
                                Don&apos;t have an account?{' '}
                            </Typography>
                            <Typography>
                                <Link
                                    component={RouterLink}
                                    to={SmaiaXAbsoluteRoutes.SIGN_UP}
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CustomAuthCard>
            </CustomAuthCardContainer>
        </Box>
    );
}
