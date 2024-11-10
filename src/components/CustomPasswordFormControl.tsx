import FormControl from "@mui/material/FormControl";
import { InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface CustomPasswordFormControlProps {
    password: string;
    onPasswordChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const CustomPasswordFormControl: React.FC<CustomPasswordFormControlProps> = ({ password, onPasswordChange, label }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
            />
        </FormControl>
    );
};

export default CustomPasswordFormControl;
