import { Button, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import { useNavigate } from 'react-router-dom';
import SmartMeterCard from '../../components/smartMeter/SmartMeterCard.tsx';
import { useDialogs } from '@toolpad/core';
import CustomDialogWithDeviceConfiguration from '../../components/dialogs/CustomDialogWithDeviceConfiguration.tsx';
import CustomAddSmartMeterDialog from '../../components/dialogs/CustomAddSmartMeterDialog.tsx';
import { MediaQueryMaxWidthStr } from '../../constants/constants.ts';

const SmartMetersPage = () => {
    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[] | undefined>(undefined);
    const [recentlyAddedSmartMeter, setRecentlyAddedSmartMeter] = useState<string | undefined>(undefined);

    const { getSmartMeters } = useSmartMeterService();
    const isSmallScreen = useMediaQuery(MediaQueryMaxWidthStr);
    const dialogs = useDialogs();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        void loadSmartMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSmartMeters = async (recentlyAddedSmartMeter?: string) => {
        try {
            const sms = await getSmartMeters();
            const sortedSms = sms
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => (a.name === recentlyAddedSmartMeter ? -1 : b.name === recentlyAddedSmartMeter ? 1 : 0));
            setSmartMeters(sortedSms);
            setRecentlyAddedSmartMeter(recentlyAddedSmartMeter);

            if (recentlyAddedSmartMeter) {
                setTimeout(() => {
                    setRecentlyAddedSmartMeter(undefined);
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meters!`);
        }
    };

    const openDialogWithDeviceConfigurationDialog = async () => {
        await dialogs.open(CustomDialogWithDeviceConfiguration);
    };

    const openAddSmartMeterDialog = async () => {
        await dialogs.open(CustomAddSmartMeterDialog, {
            reloadSmartMeters: (smartMeterName) => {
                void loadSmartMeters(smartMeterName);
            },
            isSmartMeterNameUnique: (smartMeterName) => {
                if (smartMeters == null) {
                    return false;
                }

                return !smartMeters.map((smartMeter) => smartMeter.name).includes(smartMeterName);
            },
        });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%', width: '100%' }}>
            <div>
                <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                        void openAddSmartMeterDialog();
                    }}>
                    Add Smart Meter
                </Button>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                    justifyContent: isSmallScreen ? 'center' : 'space-evenly',
                    alignItems: 'center',
                }}>
                {smartMeters?.map((sm) => (
                    <div
                        key={sm.id}
                        className={recentlyAddedSmartMeter === sm.name ? 'pulse-effect' : ''}
                        style={{
                            flex: isSmallScreen ? '1 1 100%' : '1 1 30%',
                            boxSizing: 'border-box',
                        }}>
                        <SmartMeterCard
                            smartMeterOverview={sm}
                            navigateToDetails={() => {
                                navigate(`/smart-meters/${sm.id}`);
                            }}
                            kebabItems={[
                                {
                                    name: 'Device configuration',
                                    onClick: () => void openDialogWithDeviceConfigurationDialog(),
                                },
                            ]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartMetersPage;
