import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {DialogProps} from "@toolpad/core";
import TextField from "@mui/material/TextField";
import {InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff, Download} from "@mui/icons-material";
import React, {useState} from "react";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

export default function MyCustomDialog({ open, onClose } : DialogProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleDownload = () => {
        // Create a JSON object with the SSID and password
        const data = {
            wifiSSID: ssid,
            wifiPassword: password
        };

        // Convert JSON object to a string and create a Blob
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wifi-config.json';

        // Programmatically click the link to trigger the download, then revoke the object URL
        link.click();
        URL.revokeObjectURL(link.href);
    };

    function onNetworkNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSsid(e.target.value);
    }

    function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    return (
        <Dialog fullWidth open={open} onClose={() => onClose()}>
            <DialogTitle>Device Configuration</DialogTitle>
            <DialogContent>
                <Typography
                    variant="body2"
                component="p"
                >Please enter your home WIFI network information to configure the connector.</Typography>
                <TextField
                    label="WIFI Network Name (SSID)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={ssid}
                    onChange={onNetworkNameChange}
                />
                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="outlined-adornment-password">WIFI Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={onPasswordChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="WIFI Password"
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleDownload}
                    variant="outlined"
                    endIcon={<Download />}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
}