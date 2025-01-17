import React, { useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart, { ChartOptions } from './charts/MeasurementLineChart.tsx';
import dayjs, { Dayjs } from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import { RawVariableLabelMap, RawVariables } from '../../constants/variableConstants.ts';
import { MeasurementRawDto, MeasurementResolution } from '../../api/openAPI';
import { useTheme } from '@mui/material/styles';

interface MeasurementSectionProps {
    smartMeterId: string;
    chartOptions: ChartOptions;
    backgroundColor?: string;
    padding?: string;
}

type RawVariablesOptionsKeys = keyof RawVariables | 'all';
// type AggregatedVariablesOptions = keyof AggregatedVariables | 'all';

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
    smartMeterId,
    chartOptions,
    backgroundColor,
    padding,
}) => {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [measurements, setMeasurements] = useState<MeasurementRawDto[]>([]);
    const [selectedVariables, setSelectedVariables] = useState<RawVariablesOptionsKeys[]>(['all']);

    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs());

    const { showSnackbar } = useSnackbar();
    const { getMeasurements } = useMeasurementService();

    const variableOptions = Object.entries(RawVariableLabelMap) as [keyof RawVariables, string][];
    const allOption: [RawVariablesOptionsKeys, string] = ['all', 'All'];

    const handleVariableChange = (variables: RawVariablesOptionsKeys[]): void => {
        setSelectedVariables(variables);
    };

    const filterMeasurements = (measurements: MeasurementRawDto[]): MeasurementRawDto[] => {
        if (selectedVariables.length <= 0 || selectedVariables.includes('all')) {
            return measurements;
        }

        return measurements.map((measurement) => {
            const filteredMeasurement: MeasurementRawDto = {
                uptime: measurement.uptime,
                timestamp: measurement.timestamp,
            };

            selectedVariables.forEach((variable) => {
                const measurementKey = variable as keyof MeasurementRawDto;

                if (measurementKey in measurement) {
                    // @ts-expect-error - this will work as intended
                    filteredMeasurement[measurementKey] = measurement[measurementKey];
                }
            });

            return filteredMeasurement;
        });
    };

    const handleLoadData = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const measurements = await getMeasurements(
                smartMeterId,
                MeasurementResolution.Raw,
                startAt.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                endAt.format('YYYY-MM-DDTHH:mm:ss[Z]')
            );

            if (measurements.measurementRawList != null) {
                setMeasurements(filterMeasurements(measurements.measurementRawList));
            }
        } catch (error) {
            console.error(error);
            showSnackbar('error', `Failed to load measurements!`);
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
                        multiple
                        options={[allOption, ...variableOptions]}
                        getOptionLabel={(option) => (option ? option[1] : '')}
                        disableCloseOnSelect
                        value={selectedVariables.map((key) =>
                            key === 'all' ? allOption : variableOptions.find(([optionKey]) => optionKey === key)
                        )}
                        onChange={(_, variables) => {
                            const filteredVariables = variables.filter(
                                (item): item is [RawVariablesOptionsKeys, string] => item !== undefined
                            );
                            const keys: RawVariablesOptionsKeys[] = filteredVariables.map(([key]) => key);

                            handleVariableChange(keys);
                        }}
                        renderOption={(
                            props: React.HTMLAttributes<HTMLLIElement> & {
                                key: string;
                            },
                            option,
                            { selected }
                        ) => {
                            if (!option) {
                                return null;
                            }

                            const label = option[1];
                            const { key: key, ...rest } = props;

                            return (
                                <li key={key} {...rest}>
                                    <Checkbox
                                        style={{ marginRight: 8 }}
                                        checked={selected || selectedVariables.includes('all')}
                                    />
                                    {label}
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Variables"
                                placeholder={
                                    selectedVariables.includes('all')
                                        ? 'All Variables Selected'
                                        : `${String(selectedVariables.length)} Variables Selected`
                                }
                            />
                        )}
                        slotProps={{
                            chip: {
                                sx: {
                                    display: 'none',
                                },
                            },
                        }}
                        sx={{ width: 300 }}
                    />
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
