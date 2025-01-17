import React, { useEffect, useState } from 'react';
import { MeasurementRawDto } from '../../../api/openAPI';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useCustomHighchartsTheme from '../../../hooks/useCustomHighchartsTheme.ts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { RawVariableLabelMap, RawVariables } from '../../../constants/variableConstants.ts';

export type ChartOptions = {
    height?: string;
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
};

interface MeasurementLineChartProps {
    measurements: MeasurementRawDto[];
    chartOptions: ChartOptions;
}

const MeasurementLineChart: React.FC<MeasurementLineChartProps> = ({ measurements, chartOptions }) => {
    const theme = useTheme();
    const [chartKey, setChartKey] = useState(0);

    useCustomHighchartsTheme();

    useEffect(() => {
        setChartKey((prevKey) => prevKey + 1);
    }, [theme.palette.mode]);

    const chartHeight = chartOptions.height ?? '400px';

    if (measurements.length <= 0) {
        return (
            <Box
                sx={{
                    height: chartHeight,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                }}>
                <Typography>No measurements available.</Typography>
            </Box>
        );
    }

    const variableIds = Object.entries(measurements[0]).filter(([key]) => key !== 'timestamp' && key !== 'uptime');

    const series = variableIds.map(([key]) => {
        const data = measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? '').getTime(),
            y: measurement[key as keyof MeasurementRawDto] as number,
        }));

        return {
            name: RawVariableLabelMap[key as keyof RawVariables],
            data: data,
        };
    });

    const options = {
        accessibility: {
            enabled: false,
        },
        chart: {
            type: 'line',
            height: chartHeight,
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
