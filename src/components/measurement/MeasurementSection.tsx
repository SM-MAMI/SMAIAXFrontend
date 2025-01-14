import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MeasurementLineChart from './charts/MeasurementLineChart.tsx';
import { Dayjs } from 'dayjs';
import { MeasurementDto } from '../../api/openAPI';

interface MeasurementSectionProps {
    startAt: Dayjs;
    endAt: Dayjs;
    setStartAt: (value: Dayjs) => void;
    setEndAt: (value: Dayjs) => void;
    isLoadingMeasurements: boolean;
    measurements: MeasurementDto[];
    loadMeasurements: () => void;
}

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
    startAt,
    endAt,
    setStartAt,
    setEndAt,
    isLoadingMeasurements,
    measurements,
    loadMeasurements,
}) => {
    return (
        <div style={{ padding: '1em', width: '100%' }}>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        marginBottom: '2em',
                        justifyContent: 'right',
                        alignItems: 'center',
                        gap: '1em',
                        flexWrap: 'wrap',
                    }}>
                    <DatePicker
                        label="Start"
                        value={startAt}
                        maxDate={endAt}
                        onChange={(newValue) => {
                            if (newValue) setStartAt(newValue);
                        }}
                    />
                    <DatePicker
                        label="End"
                        value={endAt}
                        minDate={startAt}
                        onChange={(newValue) => {
                            if (newValue) setEndAt(newValue);
                        }}
                    />
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={loadMeasurements}
                        sx={{
                            height: '36.5px',
                            width: '143px',
                            padding: '6px 16px',
                        }}>
                        Load data
                    </Button>
                </Box>

                {isLoadingMeasurements ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size="3em" />
                    </div>
                ) : (
                    <MeasurementLineChart measurements={measurements} />
                )}
            </Box>
        </div>
    );
};

export default MeasurementSection;
