import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart, { ChartOptions } from './charts/MeasurementLineChart.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import { useMeasurementService } from '../../hooks/services/useMeasurementService.ts';
import {
    AggregatedVariableLabelMap,
    AggregatedVariables,
    RawVariableLabelMap,
    RawVariables,
} from '../../constants/variableConstants.ts';
import { MeasurementAggregatedDto, MeasurementRawDto, MeasurementResolution } from '../../api/openAPI';
import { useTheme } from '@mui/material/styles';
import CustomVariableAutoComplete from '../pure/CustomVariableAutoComplete.tsx';

interface MeasurementSectionProps {
    smartMeterId: string;
    requestOnInitialLoad?: boolean;
    chartOptions?: ChartOptions;
    backgroundColor?: string;
    padding?: string;
}

export type RawVariablesOptionsKeys = keyof RawVariables | 'all';
export type AggregatedVariablesOptionsKeys = keyof AggregatedVariables | 'all';

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
    smartMeterId,
    requestOnInitialLoad = false,
    chartOptions = {},
    backgroundColor = '',
    padding = '1em',
}) => {
    const theme = useTheme();

    const allVariableSelect = ['all'] as (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];

    const [isLoading, setIsLoading] = useState(false);
    const [measurements, setMeasurements] = useState<Partial<MeasurementRawDto>[]>([]);
    const [selectedResolution, setSelectedResolution] = useState<MeasurementResolution>(MeasurementResolution.Raw);
    const [selectedVariables, setSelectedVariables] =
        useState<(RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]>(allVariableSelect);
    const [variableOptions, setVariableOptions] = useState<
        (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]
    >([]);

    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs());

    const { showSnackbar } = useSnackbar();
    const { getMeasurements } = useMeasurementService();

    useEffect(() => {
        if (selectedResolution === MeasurementResolution.Raw) {
            setVariableOptions(Object.keys(RawVariableLabelMap) as RawVariablesOptionsKeys[]);
        } else {
            setVariableOptions(Object.keys(AggregatedVariableLabelMap) as AggregatedVariablesOptionsKeys[]);
        }
    }, [selectedResolution]);

    const hasExecutedInitialHandleLoadData = useRef(false);
    useEffect(() => {
        if (hasExecutedInitialHandleLoadData.current || !requestOnInitialLoad) {
            return;
        }

        void handleLoadData(requestOnInitialLoad);
        hasExecutedInitialHandleLoadData.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestOnInitialLoad]);

    const handleResolutionChange = (resolution: MeasurementResolution) => {
        setSelectedResolution(resolution);
        setSelectedVariables(allVariableSelect);
    };

    const handleVariableChange = (variables: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]): void => {
        setSelectedVariables(variables);
    };

    const filterMeasurements = (
        measurements: (MeasurementRawDto | MeasurementAggregatedDto)[]
    ): Partial<MeasurementRawDto | MeasurementAggregatedDto>[] => {
        if (selectedVariables.length <= 0 || selectedVariables.includes(allVariableSelect[0])) {
            return measurements;
        }

        return measurements.map((measurement) => {
            const filteredMeasurement: Partial<MeasurementRawDto | MeasurementAggregatedDto> = {
                uptime: measurement.uptime,
                timestamp: measurement.timestamp,
            };

            selectedVariables.forEach((variable) => {
                if (variable in measurement) {
                    const key = variable as keyof (MeasurementRawDto | MeasurementAggregatedDto);
                    (filteredMeasurement as Record<string, unknown>)[key] = measurement[key];
                }
            });

            return filteredMeasurement;
        });
    };

    const handleLoadData = async (isInitialLoad = false): Promise<void> => {
        try {
            setIsLoading(true);
            setMeasurements([]);

            const measurements = await getMeasurements(
                smartMeterId,
                selectedResolution,
                startAt.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                endAt.format('YYYY-MM-DDTHH:mm:ss[Z]')
            );

            if (measurements.measurementRawList || measurements.measurementAggregatedList) {
                const rawList = measurements.measurementRawList ?? [];
                const aggregatedList = measurements.measurementAggregatedList ?? [];

                if (rawList.length === 0 && aggregatedList.length === 0) {
                    if (!isInitialLoad) {
                        showSnackbar('info', 'No data points for requested time range available!');
                    }

                    return;
                }

                if (rawList.length > 0) {
                    setMeasurements(filterMeasurements(rawList));
                } else if (aggregatedList.length > 0) {
                    setMeasurements(filterMeasurements(aggregatedList));
                }
            }
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to load measurements!');
        } finally {
            setIsLoading(false);
        }
    };

    const useBoxShadow = backgroundColor === '';

    return (
        <Box
            sx={{
                width: '100%',
                padding: padding,
                backgroundColor: backgroundColor,
            }}>
            <Box
                sx={{
                    display: 'flex',
                    marginBottom: '1em',
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
                    <CustomVariableAutoComplete
                        selectedVariables={selectedVariables}
                        onChange={handleVariableChange}
                        variableOptions={variableOptions}
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) => {
                            if (newValue) {
                                setStartAt(newValue);
                            }
                        }}
                        sx={{ maxWidth: 145, minWidth: 100 }}
                    />
                    <DatePicker
                        label="End"
                        value={endAt}
                        minDate={startAt}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => {
                            if (newValue) {
                                setEndAt(newValue);
                            }
                        }}
                        sx={{ maxWidth: 145, minWidth: 100 }}
                    />
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => {
                            if (selectedVariables.length <= 0) {
                                setMeasurements([]);
                                return;
                            }

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
                    boxShadow={useBoxShadow ? theme.shadows[1] : ''}
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
                <MeasurementLineChart
                    measurements={measurements}
                    chartOptions={chartOptions}
                    useBoxShadow={useBoxShadow}
                />
            )}
        </Box>
    );
};

export default MeasurementSection;
