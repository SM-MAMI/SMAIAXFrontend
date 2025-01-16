import React, { useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart, { ChartOptions } from './charts/MeasurementLineChart.tsx';
import { Dayjs } from 'dayjs';
import { MeasurementDto } from '../../api/openAPI';
import { VariableLabelMap } from '../../constants/constants.ts';
import Checkbox from '@mui/material/Checkbox';

interface MeasurementSectionProps {
    startAt: Dayjs;
    endAt: Dayjs;
    setStartAt: (value: Dayjs) => void;
    setEndAt: (value: Dayjs) => void;
    isLoadingMeasurements: boolean;
    measurements: MeasurementDto[];
    loadMeasurements: (selectedVariables: string[]) => void;
    chartOptions: ChartOptions;
    backgroundColor?: string;
    padding?: string;
}

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
    startAt,
    endAt,
    setStartAt,
    setEndAt,
    isLoadingMeasurements,
    measurements,
    loadMeasurements,
    chartOptions,
    backgroundColor,
    padding,
}) => {
    const [selectedVariables, setSelectedVariables] = useState<string[]>(['All']);

    const availableVariables = Object.keys(VariableLabelMap);
    const autoCompleteOptions = ['All', ...availableVariables.map((key) => VariableLabelMap[key])];

    const handleVariableChange = (value: string[]): void => {
        if (value.includes('All')) {
            setSelectedVariables(['All']);
        } else {
            setSelectedVariables(value);
        }
    };

    const handleLoadData = (): void => {
        loadMeasurements(selectedVariables.includes('All') ? availableVariables : selectedVariables);
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
                        options={autoCompleteOptions}
                        disableCloseOnSelect
                        value={selectedVariables.map((key) => (key === 'All' ? 'All' : VariableLabelMap[key]))}
                        onChange={(_, value) => {
                            const keys = value.map((label) =>
                                label === 'All'
                                    ? 'All'
                                    : Object.keys(VariableLabelMap).find((key) => VariableLabelMap[key] === label)
                            );
                            handleVariableChange(keys as string[]);
                        }}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected || selectedVariables.includes('All')}
                                />
                                {option}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Variables"
                                placeholder={
                                    selectedVariables.includes('All')
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
                        onClick={handleLoadData}
                        sx={{
                            height: '36.5px',
                            width: '143px',
                            padding: '6px 16px',
                        }}>
                        Load data
                    </Button>
                </Box>
            </Box>

            {isLoadingMeasurements ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size="3em" />
                </div>
            ) : (
                <MeasurementLineChart measurements={measurements} chartOptions={chartOptions} />
            )}
        </Box>
    );
};

export default MeasurementSection;
