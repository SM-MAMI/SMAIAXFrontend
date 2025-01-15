import React, { useEffect, useState } from 'react';
import { MeasurementDto } from '../../../api/openAPI';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useCustomHighchartsTheme from '../../../hooks/useCustomHighchartsTheme.ts';
import { useTheme } from '@mui/material/styles';
import { VariableLabelMap } from '../../../constants/constants.ts';
import { Box } from '@mui/material';

export type ChartOptions = {
    title?: string;
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
        },
        title: {
            text: chartOptions.title ?? 'Measurement',
        },
        xAxis: {
            title: {
                text: 'Timestamp',
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%H:%M:%S',
            },
        },
        yAxis: {
            title: {
                text: 'Value',
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
