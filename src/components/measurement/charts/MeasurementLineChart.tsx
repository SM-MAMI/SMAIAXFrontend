import React, { useEffect, useState } from 'react';
import { MeasurementDto } from '../../../api/openAPI';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useCustomHighchartsTheme from '../../../hooks/useCustomHighchartsTheme.ts';
import { useTheme } from '@mui/material/styles';
import { VariableLabelMap } from '../../../constants/constants.ts';
import { Box, Typography } from '@mui/material';

export type ChartOptions = {
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
};

interface MeasurementLineChartProps {
    measurements: MeasurementDto[];
    chartOptions: ChartOptions;
}

const MeasurementLineChart: React.FC<MeasurementLineChartProps> = ({ measurements, chartOptions }) => {
    const theme = useTheme();
    const [chartKey, setChartKey] = useState(0);

    useCustomHighchartsTheme();

    useEffect(() => {
        setChartKey((prevKey) => prevKey + 1);
    }, [theme.palette.mode]);

    if (measurements.length <= 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>No measurements available.</Typography>
            </Box>
        );
    }

    const variableIds = Object.entries(measurements[0]).filter(([key]) => key !== 'timestamp' && key !== 'uptime');

    const series = variableIds.map(([key]) => {
        const data = measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? '').getTime(),
            y: measurement[key as keyof MeasurementDto] as number,
        }));

        return {
            name: VariableLabelMap[key] ?? key,
            data: data,
        };
    });

    const options = {
        chart: {
            type: 'line',
            height: '400px',
        },
        title: {
            text: chartOptions.title ?? 'Measurement',
        },
        xAxis: {
            title: {
                text: chartOptions.xAxisTitle ?? '',
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%H:%M:%S',
            },
        },
        yAxis: {
            title: {
                text: chartOptions.yAxisTitle ?? '',
            },
        },
        series: series,
    };

    return (
        <Box boxShadow={theme.shadows[1]}>
            <HighchartsReact key={chartKey} highcharts={Highcharts} options={options} />
        </Box>
    );
};

export default MeasurementLineChart;
