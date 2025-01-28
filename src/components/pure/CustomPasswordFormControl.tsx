import FormControl from '@mui/material/FormControl';
import { FormHelperText, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface CustomPasswordFormControlProps {
    password: string;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    isRequired?: boolean;
    error?: boolean;
    helperText?: string;
    color?: 'error' | 'primary';
}

const CustomPasswordFormControl: React.FC<CustomPasswordFormControlProps> = ({
    password,
    onPasswordChange,
    label,
    isRequired = false,
    error = false,
    helperText = '',
    color = 'primary',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel
                required={isRequired}
                htmlFor="outlined-adornment-password"
                sx={{
                    color: error ? 'error.main' : '',
                    '&.Mui-focused': {
                        color: error ? 'error.main' : '',
                    },
                }}>
                {label}
            </InputLabel>
            <OutlinedInput
                required={isRequired}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChange}
                error={error}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
                color={color}
            />
            {helperText && <FormHelperText sx={{ color: error ? 'error.main' : '' }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomPasswordFormControl;
