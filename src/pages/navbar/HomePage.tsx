import { useEffect, useState } from 'react';
import { MeasurementDto, SmartMeterOverviewDto } from '../../api/openAPI';
import { useSmartMeterService } from '../../hooks/services/useSmartMeterService.ts';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, CircularProgress } from '@mui/material';
import MeasurementSection from '../../components/measurement/MeasurementSection.tsx';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

export default function HomePage() {
    const [smartMeters, setSmartMeters] = useState<SmartMeterOverviewDto[] | undefined>(undefined);
    const [measurementSections, setMeasurementSections] = useState<string[]>([]);
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState<boolean>(false);
    const [measurementsPerSmartMeter, setMeasurementsPerSmartMeter] = useState<Record<string, MeasurementDto[]>>({});
    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs());

    const { getSmartMeters } = useSmartMeterService();
    const { getMeasurements } = useMeasurementService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        void loadSmartMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (smartMeters) {
            smartMeters.forEach((meter) => {
                void loadMeasurements(meter.id, ['All']);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeters]);

    const loadSmartMeters = async () => {
        try {
            const smartMeters = await getSmartMeters();
            const sortedSmartMeters = smartMeters.sort((a, b) => a.name.localeCompare(b.name));
            setSmartMeters(sortedSmartMeters);
            setMeasurementSections(sortedSmartMeters.map((meter) => meter.id)); // Initialize sections for each smart meter
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

    return (
        <PageContainer title={''}>
            {!smartMeters ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em', width: '100%' }}>
                    {measurementSections.map((smartMeterId) => {
                        const smartMeter = smartMeters.find((smartMeter) => smartMeter.id === smartMeterId);

                        return (
                            smartMeter && (
                                <>
                                    <MeasurementSection
                                        key={smartMeter.id}
                                        startAt={startAt}
                                        endAt={endAt}
                                        setStartAt={setStartAt}
                                        setEndAt={setEndAt}
                                        isLoadingMeasurements={isLoadingMeasurements}
                                        measurements={measurementsPerSmartMeter[smartMeter.id] ?? []}
                                        loadMeasurements={(selectedVariables) =>
                                            void loadMeasurements(smartMeter.id, selectedVariables)
                                        }
                                        chartOptions={{ title: smartMeter.name }}
                                    />
                                    <Divider sx={{ margin: '2em' }} />
                                </>
                            )
                        );
                    })}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em', padding: '1em' }}>
                        <Button sx={{ width: '143px' }} variant="contained" size="medium">
                            Add Chart
                        </Button>
                    </Box>
                </Box>
            )}
        </PageContainer>
    );
}
