import { FC, useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart, { ChartOptions } from './charts/MeasurementLineChart.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useSnackbar } from '../../hooks/useSnackbar.ts';
import {
    AggregatedVariableLabelMap,
    AggregatedVariables,
    RawVariableLabelMap,
    RawVariables,
} from '../../constants/variableConstants.ts';
import {
    MeasurementAggregatedDto,
    MeasurementListDto,
    MeasurementRawDto,
    MeasurementResolution,
} from '../../api/openAPI';
import { useTheme } from '@mui/material/styles';
import CustomVariableAutoComplete from '../pure/CustomVariableAutoComplete.tsx';
import { ContractId, PolicyId, SmartMeterId } from '../../utils/helper.ts';

type MeasurementSourceId = SmartMeterId | PolicyId | ContractId;

interface MeasurementSectionProps {
    measurementSourceId: MeasurementSourceId;
    getMeasurements: (
        measurementSourceId: MeasurementSourceId,
        resolution: MeasurementResolution,
        startAt: string,
        endAt: string
    ) => Promise<MeasurementListDto>;
    chartOptions: ChartOptions;
    defaultResolution?: MeasurementResolution;
    highestAvailableResolution?: MeasurementResolution;
    requestOnInitialLoad?: boolean;
    backgroundColor?: string;
    padding?: string;
}

export type RawVariablesOptionsKeys = keyof RawVariables | 'all';
export type AggregatedVariablesOptionsKeys = keyof AggregatedVariables | 'all';

const MeasurementSection: FC<MeasurementSectionProps> = ({
    measurementSourceId,
    getMeasurements,
    chartOptions,
    defaultResolution = MeasurementResolution.QuarterHour,
    highestAvailableResolution = MeasurementResolution.Raw,
    requestOnInitialLoad = false,
    backgroundColor = '',
    padding = '1em',
}) => {
    const theme = useTheme();

    const allVariableSelect = ['all'] as (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];
    const resolutionOrder = [
        MeasurementResolution.Raw,
        MeasurementResolution.Minute,
        MeasurementResolution.QuarterHour,
        MeasurementResolution.Hour,
        MeasurementResolution.Day,
        MeasurementResolution.Week,
    ];

    const availableResolutions = resolutionOrder.filter(
        (res) => resolutionOrder.indexOf(res) >= resolutionOrder.indexOf(highestAvailableResolution)
    );

    const validatedDefaultResolution =
        resolutionOrder.indexOf(defaultResolution) >= resolutionOrder.indexOf(highestAvailableResolution)
            ? defaultResolution
            : highestAvailableResolution;

    const [selectedResolution, setSelectedResolution] = useState<MeasurementResolution>(validatedDefaultResolution);

    const [isLoading, setIsLoading] = useState(false);
    const [measurements, setMeasurements] = useState<Partial<MeasurementRawDto>[]>([]);
    const [variableError, setVariableError] = useState(false);
    const [selectedVariables, setSelectedVariables] = useState<
        (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]
    >(['avgVoltagePhase1', 'avgVoltagePhase2', 'avgVoltagePhase3']);
    const [variableOptions, setVariableOptions] = useState<
        (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]
    >([]);

    const [startAt, setStartAt] = useState<Dayjs>(dayjs().subtract(1, 'day').startOf('day'));
    const [endAt, setEndAt] = useState<Dayjs>(dayjs().startOf('day'));

    const { showSnackbar } = useSnackbar();

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

        if (highestAvailableResolution !== MeasurementResolution.Raw) {
            return;
        }

        if (selectedResolution === MeasurementResolution.Raw && resolution !== MeasurementResolution.Raw) {
            const updatedVariables = selectedVariables.map((variable) => {
                return variable.startsWith('avg')
                    ? variable
                    : `avg${variable.charAt(0).toUpperCase()}${variable.slice(1)}`;
            }) as (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];

            setSelectedVariables(updatedVariables);
        } else if (selectedResolution !== MeasurementResolution.Raw && resolution === MeasurementResolution.Raw) {
            const updatedVariables = selectedVariables.map((variable) => {
                const noPrefix = variable.replace(/^(avg|min|max|med)/, '');
                return noPrefix.charAt(0).toLowerCase() + noPrefix.slice(1);
            }) as (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];

            const uniqueVariables = Array.from(new Set(updatedVariables));
            setSelectedVariables(uniqueVariables);
        }
    };

    const handleVariableChange = (variables: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]): void => {
        setVariableError(false);
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
        if (selectedVariables.length <= 0) {
            setVariableError(true);
            setMeasurements([]);
            return;
        }

        try {
            setIsLoading(true);
            setMeasurements([]);
            setVariableError(false);

            const measurements = await getMeasurements(
                measurementSourceId,
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

            if (error instanceof Error) {
                showSnackbar('error', error.message);
            } else {
                showSnackbar('error', 'Failed to load measurements!');
            }
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
                        options={availableResolutions}
                        getOptionLabel={(option) => option}
                        value={selectedResolution}
                        onChange={(_event, value) => {
                            handleResolutionChange(value);
                        }}
                        renderInput={(params) => <TextField {...params} label="Resolution" />}
                        sx={{ width: 175 }}
                        disableClearable
                    />
                </Box>

                <Box>
                    <CustomVariableAutoComplete
                        selectedVariables={selectedVariables}
                        onChange={handleVariableChange}
                        variableOptions={variableOptions}
                        error={variableError}
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
                                setStartAt(newValue.startOf('day'));
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
                                setEndAt(newValue.startOf('day'));
                            }
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
