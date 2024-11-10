import { useState } from 'react';
import { EmailRegex } from '../constants/constants.ts';

export const useValidation = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [firstnameError, setFirstnameError] = useState(false);
    const [firstnameErrorMessage, setFirstnameErrorMessage] = useState('');
    const [lastnameError, setLastnameError] = useState(false);
    const [lastnameErrorMessage, setLastnameErrorMessage] = useState('');

    const validateEmail = (email: string): boolean => {
        if (!email || !EmailRegex.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            return false;
        }

        setEmailError(false);
        setEmailErrorMessage('');
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            return false;
        }

        setPasswordError(false);
        setPasswordErrorMessage('');
        return true;
    };

    const validateFirstname = (firstname: string): boolean => {
        if (!firstname || firstname.length < 1) {
            setFirstnameError(true);
            setFirstnameErrorMessage('First name is required.');
            return false;
        }

        setFirstnameError(false);
        setFirstnameErrorMessage('');
        return true;
    };

    const validateLastname = (lastname: string): boolean => {
        if (!lastname || lastname.length < 1) {
            setLastnameError(true);
            setLastnameErrorMessage('Last name is required.');
            return false;
        }

        setLastnameError(false);
        setLastnameErrorMessage('');
        return true;
    };

    return {
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
    };
};
