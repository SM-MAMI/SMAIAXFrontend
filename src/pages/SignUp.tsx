import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Card, CardContainer } from '../components/auth/CardContainer.tsx';
import { RegisterDto } from '../api/openAPI';
import { useValidation } from '../hooks/useValidation.ts';
import { useAuthenticationService } from '../hooks/services/useAuthenticationService.ts';
import { useSnackbar } from '../hooks/useSnackbar.ts';
import { SmaiaxTextAndDotsIcon } from '../assets/SmaiaxTextAndDots.tsx';
import { SmaiaXAbsoluteRoutes } from '../constants/constants.ts';
import CustomPasswordFormControl from '../components/pure/CustomPasswordFormControl.tsx';

export default function SignUp() {
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');

    const {
        emailError,
        emailErrorMessage,
        passwordError,
        firstnameError,
        firstnameErrorMessage,
        lastnameError,
        lastnameErrorMessage,
        usernameError,
        usernameErrorMessage,
        validateEmail,
        validatePassword,
        validateFirstname,
        validateLastname,
        validateUsername,
    } = useValidation();

    const { register } = useAuthenticationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setConfirmPassword(value);

        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage('');
    };

    const validateInputs = (registerDto: RegisterDto) => {
        let isValid = true;

        if (!validateEmail(registerDto.email)) {
            isValid = false;
        }

        if (!validatePassword(registerDto.password)) {
            isValid = false;
        }

        if (!validateFirstname(registerDto.name.firstName)) {
            isValid = false;
        }

        if (!validateLastname(registerDto.name.lastName)) {
            isValid = false;
        }

        if (!validateUsername(registerDto.username)) {
            isValid = false;
        }

        if (registerDto.password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const registerDto: RegisterDto = {
            email: data.get('email') as string,
            password: password,
            username: data.get('username') as string,
            name: {
                firstName: data.get('firstname') as string,
                lastName: data.get('lastname') as string,
            },
        };

        if (!validateInputs(registerDto)) {
            return;
        }

        try {
            await register(registerDto);

            showSnackbar('success', 'Successfully signed up!');
            void navigate(SmaiaXAbsoluteRoutes.SIGN_IN);
        } catch (error) {
            showSnackbar('error', 'Registration failed!');
            console.error('Registration failed:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            <CardContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SmaiaxTextAndDotsIcon />

                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            textAlign: 'center',
                        }}>
                        Sign up
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={(event) => {
                            void handleSubmit(event);
                        }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                id="firstname"
                                name="firstname"
                                autoComplete="firstname"
                                error={firstnameError}
                                helperText={firstnameErrorMessage}
                                color={firstnameError ? 'error' : 'primary'}
                                label={'First name'}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                id="lastname"
                                name="lastname"
                                autoComplete="lastname"
                                error={lastnameError}
                                helperText={lastnameErrorMessage}
                                color={lastnameError ? 'error' : 'primary'}
                                label={'Last name'}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                name="username"
                                autoComplete="username"
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                color={usernameError ? 'error' : 'primary'}
                                label={'Username'}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                label={'Email'}
                            />
                        </FormControl>
                        <CustomPasswordFormControl
                            isRequired={true}
                            password={password}
                            error={passwordError}
                            helperText={
                                'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character.'
                            }
                            color={passwordError ? 'error' : 'primary'}
                            onPasswordChange={handlePasswordChange}
                            label="Password"
                        />
                        <CustomPasswordFormControl
                            isRequired={true}
                            password={confirmPassword}
                            error={confirmPasswordError}
                            helperText={confirmPasswordErrorMessage}
                            color={confirmPasswordError ? 'error' : 'primary'}
                            onPasswordChange={handleConfirmPasswordChange}
                            label="Confirm Password"
                        />
                        <Divider />
                        <Button type="submit" fullWidth variant="contained">
                            Sign up
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ textAlign: 'center', marginRight: 1 }}>
                                Already have an account?
                            </Typography>
                            <Typography>
                                <Link
                                    component={RouterLink}
                                    to={SmaiaXAbsoluteRoutes.SIGN_IN}
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </CardContainer>
        </Box>
    );
}
