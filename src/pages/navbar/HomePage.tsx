import { PageContainer } from '@toolpad/core/PageContainer';
import { useEffect, useState } from 'react';
import { MeasurementDto, SmartMeterOverviewDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import MeasurementSection from '../../components/measurement/MeasurementSection.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

const HomePage = () => {
    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[] | undefined>(undefined);
    const [measurementSections, setMeasurementSections] = useState<{ id: string; selectedSmartMeter: string | null }[]>(
        []
    );
    const [measurementsPerSmartMeter, setMeasurementsPerSmartMeter] = useState<Record<string, MeasurementDto[]>>({});
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState<boolean>(false);
    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs());

    const { getSmartMeters } = useSmartMeterService();
    const { getMeasurements } = useMeasurementService();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    useEffect(() => {
        void loadSmartMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (smartMeters && !measurementSections.length) {
            const initialSections = smartMeters.map((smartMeter) => ({
                id: smartMeter.id,
                selectedSmartMeter: smartMeter.id,
            }));
            setMeasurementSections(initialSections);

            smartMeters.forEach((smartMeter) => {
                void loadMeasurements(smartMeter.id, ['All']);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeters]);

    const loadSmartMeters = async () => {
        try {
            const smartMeters = await getSmartMeters();
            const sortedSmartMeters = smartMeters.sort((a, b) => a.name.localeCompare(b.name));
            setSmartMeters(sortedSmartMeters);
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load smart meters!`);
        }
    };

    const loadMeasurements = async (smartMeterId: string, _selectedVariables: string[]) => {
        setIsLoadingMeasurements(true);

        try {
            const measurements = await getMeasurements(
                smartMeterId,
                startAt.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                endAt.format('YYYY-MM-DDTHH:mm:ss[Z]')
            );
            setMeasurementsPerSmartMeter((prev) => ({ ...prev, [smartMeterId]: measurements }));
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load measurements!`);
        }

        setIsLoadingMeasurements(false);
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
        return smartMeters?.find((smartMeter) => smartMeter.id === smartMeterId)?.name ?? '';
    };

    return (
        <PageContainer title={''}>
            {!smartMeters ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em', width: '100%', padding: '1em' }}>
                    {measurementSections.map((section) => (
                        <Box key={section.id} sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                            <Autocomplete
                                options={smartMeters.map((smartMeter) => smartMeter.id)}
                                getOptionLabel={getSmartMeterName}
                                value={section.selectedSmartMeter}
                                onChange={(_, newValue) => {
                                    updateSectionSmartMeter(section.id, newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Smart Meter" />}
                            />

                            {section.selectedSmartMeter && (
                                <>
                                    <MeasurementSection
                                        backgroundColor={theme.palette.background.paper}
                                        startAt={startAt}
                                        endAt={endAt}
                                        setStartAt={setStartAt}
                                        setEndAt={setEndAt}
                                        isLoadingMeasurements={isLoadingMeasurements}
                                        measurements={measurementsPerSmartMeter[section.selectedSmartMeter] ?? []}
                                        loadMeasurements={(selectedVariables) => {
                                            if (section.selectedSmartMeter == null) {
                                                return;
                                            }

                                            void loadMeasurements(section.selectedSmartMeter, selectedVariables);
                                        }}
                                        chartOptions={{ title: '' }}
                                    />
                                    <Divider sx={{ margin: '2em' }} />
                                </>
                            )}
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em', padding: '2em' }}>
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
