import { useState } from 'react';
import { EmailRegex, PasswordRegex, UsernameRegex } from '../constants/constants';

export const isNullOrEmptyOrWhiteSpaces = (str: string | null | undefined) => {
    return str === null || str === undefined || RegExp(/^ *$/).exec(str) !== null;
};

export const useValidation = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [firstnameError, setFirstnameError] = useState(false);
    const [firstnameErrorMessage, setFirstnameErrorMessage] = useState('');
    const [lastnameError, setLastnameError] = useState(false);
    const [lastnameErrorMessage, setLastnameErrorMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

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
        if (!password || password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            return false;
        }

        if (!PasswordRegex.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage(
                'Password must contain at least one uppercase letter, ' +
                    'one lowercase letter, one number, and one special character.'
            );
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

    const validateUsername = (username: string): boolean => {
        if (!username || username.length < 1) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
            return false;
        }

        if (!UsernameRegex.test(username)) {
            setUsernameError(true);
            setUsernameErrorMessage('Username can only contain letters and numbers.');
            return false;
        }

        setUsernameError(false);
        setUsernameErrorMessage('');
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
        usernameError,
        usernameErrorMessage,
        validateEmail,
        validatePassword,
        validateFirstname,
        validateLastname,
        validateUsername,
    };
};
