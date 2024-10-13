import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SitemarkIcon } from '../assets/CustomIcons.tsx';
import { Link as RouterLink } from 'react-router-dom';
import { CardContainer, Card } from '../components/CardContainer.tsx';
import { useValidation } from '../hooks/useValidation.ts';

export default function SignUp() {
    const {
        emailError,
        emailErrorMessage,
        passwordError,
        passwordErrorMessage,
        firstnameError,
        firstnameErrorMessage,
        lastnameError,
        lastnameErrorMessage,
        validateEmail,
        validatePassword,
        validateFirstname,
        validateLastname,
    } = useValidation();

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const firstname = document.getElementById('firstname') as HTMLInputElement;
        const lastname = document.getElementById('lastname') as HTMLInputElement;

        let isValid = true;

        if (!validateEmail(email.value)) {
            isValid = false;
        }

        if (!validatePassword(password.value)) {
            isValid = false;
        }

        if (!validateFirstname(firstname.value)) {
            isValid = false;
        }

        if (!validateLastname(lastname.value)) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        console.log({
            name: data.get('name'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', }}>
            <CardContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />

                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            textAlign: 'center',
                        }}
                    >
                        Sign up
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="firstname">First name</FormLabel>
                            </Box>
                            <TextField
                                autoComplete="firstname"
                                name="firstname"
                                required
                                fullWidth
                                id="firstname"
                                placeholder="Jon"
                                error={firstnameError}
                                helperText={firstnameErrorMessage}
                                color={firstnameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="lastname">Last name</FormLabel>
                            </Box>
                            <TextField
                                autoComplete="lastname"
                                name="lastname"
                                required
                                fullWidth
                                id="lastname"
                                placeholder="Snow"
                                error={lastnameError}
                                helperText={lastnameErrorMessage}
                                color={lastnameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                            </Box>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                            </Box>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <Divider />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ textAlign: 'center', marginRight: 1 }}>
                                Already have an account?
                            </Typography>
                            <Typography>
                                <Link
                                    component={RouterLink}
                                    to="/signin"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
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
