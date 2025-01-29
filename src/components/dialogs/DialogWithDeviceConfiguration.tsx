import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogProps } from '@toolpad/core';
import TextField from '@mui/material/TextField';
import { Download } from '@mui/icons-material';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { EncryptionService } from '../../utils/encryptionService.ts';
import CustomPasswordFormControl from '../pure/CustomPasswordFormControl.tsx';
import { useDeviceConfigService } from '../../hooks/services/useDeviceConfigService.ts';
import CustomDialog from '../pure/CustomDialog.tsx';
import CustomDialogActions from '../pure/CustomDialogActions.tsx';
import CustomDialogContent from '../pure/CustomDialogContent.tsx';

interface CustomDialogWithDeviceConfigurationPayload {
    smartMeterId: string;
}

export default function DialogWithDeviceConfiguration({
    payload,
    open,
    onClose,
}: Readonly<DialogProps<CustomDialogWithDeviceConfigurationPayload>>) {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [ssidError, setSsidError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { getDeviceConfig } = useDeviceConfigService();

    function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        setPasswordError('');
    }

    function onNetworkNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSsid(e.target.value);
        setSsidError('');
    }

    const handleDownload = async () => {
        let valid = true;

        if (!ssid.trim()) {
            setSsidError('WIFI Network Name (SSID) is required');
            valid = false;
        }

        if (!password.trim()) {
            setPasswordError('WIFI Password is required');
            valid = false;
        }

        if (!valid) return;

        const deviceConfig = await getDeviceConfig(payload.smartMeterId);

        if (!deviceConfig.publicKey) {
            console.error('Device configuration or public key is missing');
            return;
        }

        const publicKey = deviceConfig.publicKey;
        const encryptionService = EncryptionService.Create(publicKey);

        const encryptedSsid = encryptionService.encryptData(ssid);
        const encryptedPassword = encryptionService.encryptData(password);

        const data = {
            wifiSSID: encryptedSsid,
            wifiPassword: encryptedPassword,
            mqttUsername: deviceConfig.encryptedMqttUsername,
            mqttPassword: deviceConfig.encryptedMqttPassword,
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'device-config.json';

        link.click();
        URL.revokeObjectURL(link.href);

        await onClose();
    };

    return (
        <CustomDialog open={open}>
            <DialogTitle>Device Configuration</DialogTitle>
            <CustomDialogContent>
                <Typography variant="body2" component="p">
                    Please enter your home WIFI network information to configure the connector.
                </Typography>
                <TextField
                    required
                    label="WIFI Network Name (SSID)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={ssid}
                    onChange={onNetworkNameChange}
                    error={!!ssidError}
                    helperText={ssidError}
                />
                <CustomPasswordFormControl
                    isRequired={true}
                    password={password}
                    onPasswordChange={onPasswordChange}
                    label="WIFI Password"
                    error={!!passwordError}
                    helperText={passwordError}
                />
            </CustomDialogContent>
            <CustomDialogActions>
                <Button
                    onClick={() => {
                        void handleDownload();
                    }}
                    variant="contained"
                    endIcon={<Download />}>
                    Download
                </Button>
                <Button
                    onClick={() => {
                        void onClose();
                    }}
                    variant="outlined">
                    Cancel
                </Button>
            </CustomDialogActions>
        </CustomDialog>
    );
}
