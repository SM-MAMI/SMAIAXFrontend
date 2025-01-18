import React, { useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart, { ChartOptions } from './charts/MeasurementLineChart.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import { RawVariables } from '../../constants/variableConstants.ts';
import { MeasurementRawDto, MeasurementResolution } from '../../api/openAPI';
import { useTheme } from '@mui/material/styles';
import CustomVariableAutoComplete from './CustomVariableAutoComplete.tsx';

interface MeasurementSectionProps {
    smartMeterId: string;
    chartOptions: ChartOptions;
    backgroundColor?: string;
    padding?: string;
}

export type RawVariablesOptionsKeys = keyof RawVariables | 'all';
// type AggregatedVariablesOptions = keyof AggregatedVariables | 'all';

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
    smartMeterId,
    chartOptions,
    backgroundColor,
    padding,
}) => {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [measurements, setMeasurements] = useState<Partial<MeasurementRawDto>[]>([]);
    const [selectedVariables, setSelectedVariables] = useState<RawVariablesOptionsKeys[]>(['all']);
    const [selectedResolution, setSelectedResolution] = useState<MeasurementResolution>('Raw');

    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs());

    const { showSnackbar } = useSnackbar();
    const { getMeasurements } = useMeasurementService();

    const handleResolutionChange = (resolution: MeasurementResolution) => {
        setSelectedResolution(resolution);
    };

    const handleVariableChange = (variables: RawVariablesOptionsKeys[]): void => {
        setSelectedVariables(variables);
    };

    const filterMeasurements = (measurements: MeasurementRawDto[]): Partial<MeasurementRawDto>[] => {
        if (selectedVariables.length <= 0 || selectedVariables.includes('all')) {
            return measurements;
        }

        return measurements.map((measurement) => {
            const filteredMeasurement: Partial<MeasurementRawDto> = {
                uptime: measurement.uptime,
                timestamp: measurement.timestamp,
            };

            selectedVariables.forEach((variable) => {
                if (variable in measurement) {
                    const key = variable as keyof MeasurementRawDto;
                    (filteredMeasurement as Record<string, unknown>)[key] = measurement[key];
                }
            });

            return filteredMeasurement;
        });
    };

    const handleLoadData = async (): Promise<void> => {
        try {
            setIsLoading(true);

            setMeasurements([]);

            const measurements = await getMeasurements(
                smartMeterId,
                selectedResolution,
                startAt.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                endAt.format('YYYY-MM-DDTHH:mm:ss[Z]')
            );

            if (measurements.measurementRawList != null) {
                setMeasurements(filterMeasurements(measurements.measurementRawList));
            }
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load measurements!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                padding: padding ?? '1em',
                backgroundColor: backgroundColor ?? '',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    marginBottom: '2em',
                    justifyContent: 'right',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                }}>
                <Box>
                    <Autocomplete
                        options={Object.values(MeasurementResolution)}
                        getOptionLabel={(option) => option}
                        value={selectedResolution}
                        onChange={(_event, value) => {
                            if (value == null) {
                                value = MeasurementResolution.Raw;
                            }

                            handleResolutionChange(value);
                        }}
                        renderInput={(params) => <TextField {...params} label="Resolution" />}
                        sx={{ width: 175 }}
                    />
                </Box>

                <Box>
                    <CustomVariableAutoComplete selectedVariables={selectedVariables} onChange={handleVariableChange} />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}>
                    <DatePicker
                        label="Start"
                        value={startAt}
                        maxDate={endAt}
                        onChange={(newValue) => {
                            if (newValue) setStartAt(newValue);
                        }}
                        sx={{ maxWidth: 145, minWidth: 100 }}
                    />
                    <DatePicker
                        label="End"
                        value={endAt}
                        minDate={startAt}
                        onChange={(newValue) => {
                            if (newValue) setEndAt(newValue);
                        }}
                        sx={{ maxWidth: 145, minWidth: 100 }}
                    />
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => {
                            void handleLoadData();
                        }}
                        sx={{
                            height: '36.5px',
                            width: '143px',
                            padding: '6px 16px',
                        }}>
                        Load data
                    </Button>
                </Box>
            </Box>

            {isLoading ? (
                <Box
                    sx={{
                        height: chartOptions.height ?? '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper,
                    }}>
                    <CircularProgress disableShrink variant="indeterminate" size="3em" />
                </Box>
            ) : (
                <MeasurementLineChart measurements={measurements} chartOptions={chartOptions} />
            )}
        </Box>
    );
};

export default MeasurementSection;
