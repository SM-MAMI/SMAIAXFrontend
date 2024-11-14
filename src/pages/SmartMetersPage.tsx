import { Box, FormControl, FormLabel, TextField, Button, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import { useSmartMeterService } from '../hooks/services/useSmartMeterService';
import { SmartMeterCreateDto, SmartMeterOverviewDto } from '../api/openAPI';
import { isNullOrEmptyOrWhiteSpaces } from '../hooks/useValidation';
import { useNavigate } from 'react-router-dom';
import SmartMeterCard from '../components/smartMeter/SmartMeterCard';

const SmartMetersPage = () => {
    const [addFormVisible, setAddFormVisible] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[] | undefined>(undefined);
    const [smartMeterNameError, setSmartMeterNameError] = useState(false);
    const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] = useState('');
    const [recentlyAddedSmartMeter, setRecentlyAddedSmartMeter] = useState<string | undefined>(undefined);

    const { getSmartMeters, addSmartMeter } = useSmartMeterService();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const loadSmartMeters = async (recentlyAddedSmartMeter?: string) => {
        try {
            const sms = await getSmartMeters();
            const sortedSms = sms
                .sort((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0)
                .sort((a, b) => (a.name === recentlyAddedSmartMeter ? -1 : b.name === recentlyAddedSmartMeter ? 1 : 0));
            setSmartMeters(sortedSms);
            setRecentlyAddedSmartMeter(recentlyAddedSmartMeter);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meters!`);
        }
    };

    const openAddForm = () => {
        setAddFormVisible(true);
    };

    const navigate = useNavigate();

    useEffect(() => {
        void loadSmartMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateSmartMeterName = (smName: string): boolean => {
        if (isNullOrEmptyOrWhiteSpaces(smName)) {
            setSmartMeterNameError(true);
            setSmartMeterNameErrorMessage('Smart meter name is requiered.');
            return false;
        }

        if (smartMeters?.map((sm) => sm.name).includes(smName)) {
            setSmartMeterNameError(true);
            setSmartMeterNameErrorMessage('Smart Meter Name must be unique.');
            return false;
        }

        setSmartMeterNameError(false);
        setSmartMeterNameErrorMessage('');
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const smartMeterName = data.get('smartMeterName') as string;

        const valid = validateSmartMeterName(smartMeterName);
        if (!valid) {
            return;
        }

        const smartMeterDto: SmartMeterCreateDto = {
            name: smartMeterName,
        };

        try {
            await addSmartMeter(smartMeterDto);
            setAddFormVisible(false);
            showSnackbar('success', 'Successfully added smart meter!');
            void loadSmartMeters(smartMeterDto.name);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Smart meter could not be added!`);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%', width: '100%' }}>
            <div>
                <Button variant="contained" size="large" onClick={openAddForm}>
                    +
                </Button>
            </div>
            <Box
                component="form"
                onSubmit={(event) => {
                    void handleSubmit(event);
                }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    visibility: addFormVisible ? 'visible' : 'hidden',
                    width: {
                        xs: '90%', // Applies when screen width is below 600px
                        sm: '65%', // Applies when screen width is 600px or above
                    },
                }}>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="smartMeterName">Smart Meter Name</FormLabel>
                    </Box>
                    <TextField
                        fullWidth
                        id="smartMeterName"
                        placeholder="SM1"
                        name="smartMeterName"
                        autoComplete="smartMeterName"
                        color={smartMeterNameError ? 'error' : 'primary'}
                        error={smartMeterNameError}
                        helperText={smartMeterNameErrorMessage}
                    />
                </FormControl>
                <div style={{ textAlign: 'right' }}>
                    <Button type="submit" variant="outlined">
                        Ok
                    </Button>
                </div>
            </Box>
            <div
                style={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row', // Column layout for small screens
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap', // Wrap only on larger screens
                    justifyContent: isSmallScreen ? 'center' : 'space-evenly',
                    alignItems: 'center',
                }}>
                {smartMeters?.map((sm) => (
                    <div
                        key={sm.id}
                        style={{
                            flex: isSmallScreen ? '1 1 100%' : '1 1 30%', // Full width on small screens
                            boxSizing: 'border-box',
                        }}>
                        <SmartMeterCard
                            smartMeterOverview={sm}
                            showAddMetadata={sm.name !== undefined && sm.name === recentlyAddedSmartMeter}
                            navigateToDetails={() => {
                                navigate(`/smart-meters/${sm.id ?? ''}`);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartMetersPage;
