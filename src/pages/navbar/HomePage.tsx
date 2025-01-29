import { PageContainer } from '@toolpad/core/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { SmartMeterOverviewDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import MeasurementSection from '../../components/measurement/MeasurementSection.tsx';
import { useTheme } from '@mui/material/styles';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import { SmartMeterId } from '../../utils/helper.ts';
import { SmaiaXAbsoluteRoutes } from '../../constants/constants.ts';
import NoSmartMetersCard from '../../components/smartMeter/NoSmartMeterCard.tsx';
import AddSmartMeterDialog from '../../components/dialogs/AddSmartMeterDialog.tsx';
import { useDialogs } from '@toolpad/core';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const theme = useTheme();

    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[]>([]);
    const [isSmartMetersCallPending, setIsSmartMetersCallPending] = useState(true);
    const [measurementSections, setMeasurementSections] = useState<{ id: string; selectedSmartMeter: string | null }[]>(
        []
    );

    const { getSmartMeters } = useSmartMeterService();
    const { getMeasurements } = useMeasurementService();
    const { showSnackbar } = useSnackbar();
    const dialogs = useDialogs();
    const navigate = useNavigate();

    const hasExecutedInitialLoadSmartMeters = useRef(false);
    useEffect(() => {
        if (hasExecutedInitialLoadSmartMeters.current) {
            return;
        }

        void loadSmartMeters();
        hasExecutedInitialLoadSmartMeters.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!measurementSections.length) {
            const initialSections = smartMeters.map((smartMeter) => ({
                id: smartMeter.id,
                selectedSmartMeter: smartMeter.id,
            }));
            setMeasurementSections(initialSections);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeters]);

    const loadSmartMeters = async () => {
        try {
            setIsSmartMetersCallPending(true);
            const smartMeters = await getSmartMeters();
            const sortedSmartMeters = smartMeters.sort((a, b) => a.name.localeCompare(b.name));
            setSmartMeters(sortedSmartMeters);
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load smart meters!');
        } finally {
            setIsSmartMetersCallPending(false);
        }
    };

    const addMeasurementSection = () => {
        setMeasurementSections([...measurementSections, { id: Date.now().toString(), selectedSmartMeter: null }]);
    };

    const updateSectionSmartMeter = (sectionId: string, smartMeterId: string | null) => {
        setMeasurementSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId ? { ...section, selectedSmartMeter: smartMeterId } : section
            )
        );
    };

    const getSmartMeterName = (smartMeterId: string | null): string => {
        return smartMeters.find((smartMeter) => smartMeter.id === smartMeterId)?.name ?? '';
    };

    const openAddSmartMeterDialog = async () => {
        await dialogs.open(AddSmartMeterDialog, {
            reloadSmartMeters: () => {
                void navigate(SmaiaXAbsoluteRoutes.SMART_METERS);
            },
            isSmartMeterNameUnique: (smartMeterName) => {
                return !smartMeters.map((smartMeter) => smartMeter.name).includes(smartMeterName);
            },
        });
    };

    return (
        <PageContainer title={''}>
            {isSmartMetersCallPending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : smartMeters.length <= 0 ? (
                <NoSmartMetersCard
                    title={'No smart meter data available.'}
                    onBuyClick={() => {
                        void navigate(SmaiaXAbsoluteRoutes.ORDERS);
                    }}
                    onAddClick={() => {
                        void openAddSmartMeterDialog();
                    }}
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em', height: '100%', width: '100%' }}>
                    {measurementSections.map((section) => (
                        <Box key={section.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Autocomplete
                                options={smartMeters.map((smartMeter) => smartMeter.id)}
                                getOptionLabel={getSmartMeterName}
                                value={section.selectedSmartMeter}
                                onChange={(_, newValue) => {
                                    updateSectionSmartMeter(section.id, newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Smart Meter"
                                        variant={'filled'}
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            '& .MuiFilledInput-root': {
                                                backgroundColor: theme.palette.background.paper,
                                            },
                                        }}
                                    />
                                )}
                            />

                            {section.selectedSmartMeter && (
                                <MeasurementSection
                                    measurementSourceId={section.selectedSmartMeter as SmartMeterId}
                                    getMeasurements={getMeasurements}
                                    requestOnInitialLoad={true}
                                    chartOptions={{ title: '' }}
                                    backgroundColor={theme.palette.background.paper}
                                    padding={'2em'}
                                />
                            )}
                        </Box>
                    ))}

                    <Box
                        sx={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1em', paddingRight: '2em' }}>
                        <Button
                            sx={{ width: '143px' }}
                            variant="contained"
                            size="medium"
                            onClick={addMeasurementSection}>
                            Add Chart
                        </Button>
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
};

export default HomePage;
