import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CardContainer, Card } from '../components/auth/CardContainer.tsx';
import { useValidation } from '../hooks/useValidation.ts';
import { LoginDto } from '../api/openAPI';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { useSnackbar } from '../hooks/useSnackbar.ts';
import { SmaiaXTextAndDotsIcon } from '../assets/SmaiaxTextAndDots.tsx';

export default function SignIn() {
    const { emailError, emailErrorMessage, passwordError, passwordErrorMessage } = useValidation();

    const { login } = useAuthenticationService();

    const navigate = useNavigate();

    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const loginDto: LoginDto = {
            username: data.get('email') as string,
            password: data.get('password') as string,
        };

        try {
            const tokenDto = await login(loginDto);

            localStorage.setItem('access_token', tokenDto.accessToken);
            localStorage.setItem('refresh_token', tokenDto.refreshToken);

            showSnackbar('success', 'Successfully signed in!');
            console.log(tokenDto);

            navigate('/');
        } catch (error) {
            console.log(error);
            showSnackbar('error', `Signin failed!`);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            <CardContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SmaiaXTextAndDotsIcon />

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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="email">Email / Username</FormLabel>
                            </Box>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                type="email"
                                autoFocus
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={emailError ? 'error' : 'primary'}
                                sx={{ ariaLabel: 'email' }}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                            </Box>
                            <TextField
                                required
                                fullWidth
                                id="password"
                                placeholder="••••••"
                                name="password"
                                autoComplete="current-password"
                                variant="outlined"
                                type="password"
                                autoFocus
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                        <Button type="submit" fullWidth variant="contained">
                            Sign in
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ textAlign: 'center', marginRight: 1 }}>
                                Don&apos;t have an account?{' '}
                            </Typography>
                            <Typography>
                                <Link component={RouterLink} to="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </CardContainer>
        </Box>
    );
}
