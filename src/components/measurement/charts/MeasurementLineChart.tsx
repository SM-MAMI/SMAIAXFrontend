import React, { useEffect, useState } from 'react';
import { MeasurementAggregatedDto, MeasurementRawDto } from '../../../api/openAPI';
import Highcharts, { Options, SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useCustomHighchartsTheme from '../../../hooks/useCustomHighchartsTheme.ts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
    AggregatedVariableLabelMap,
    AggregatedVariables,
    RawVariableLabelMap,
    RawVariables,
} from '../../../constants/variableConstants.ts';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';

export type ChartOptions = {
    height?: string;
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
};

interface MeasurementLineChartProps {
    measurements: Partial<MeasurementRawDto | MeasurementAggregatedDto>[];
    chartOptions?: ChartOptions;
    useBoxShadow?: boolean;
}

const MeasurementLineChart: React.FC<MeasurementLineChartProps> = ({
    measurements,
    chartOptions = {},
    useBoxShadow = true,
}) => {
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
                boxShadow={useBoxShadow ? theme.shadows[1] : ''}
                sx={{
                    height: chartHeight,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                }}>
                <Typography>No data to plot.</Typography>
            </Box>
        );
    }

    const variableIds = Object.entries(measurements[0]).filter(([key]) => key !== 'timestamp' && key !== 'uptime');

    const series: SeriesOptionsType[] = variableIds.map(([key]) => {
        const data = measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? '').getTime(),
            y: measurement[key as keyof (MeasurementRawDto | MeasurementAggregatedDto)] as unknown as number,
        }));

        return {
            type: 'line',
            name:
                RawVariableLabelMap[key as keyof RawVariables] ||
                AggregatedVariableLabelMap[key as keyof AggregatedVariables],
            data: data,
        } as SeriesOptionsType;
    });

    const chartTitleText = chartOptions.title ?? 'Measurement';
    const xAxisTitleText = chartOptions.xAxisTitle ?? '';
    const yAxisTitleText = chartOptions.yAxisTitle ?? '';

    const options: Options = {
        accessibility: {
            enabled: false,
        },
        chart: {
            type: 'line',
            height: chartHeight,
        },
        title: {
            text: chartTitleText,
        },
        xAxis: {
            title: {
                text: xAxisTitleText,
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%H:%M:%S',
            },
        },
        yAxis: {
            title: {
                text: yAxisTitleText,
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 800,
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                    },
                },
            ],
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    menuItems: ['viewFullscreen', 'printChart', 'separator', 'downloadCSV', 'downloadXLS', 'viewData'],
                },
            },
        },
        series: series,
    };

    return (
        <Box boxShadow={useBoxShadow ? theme.shadows[1] : ''}>
            <HighchartsReact key={chartKey} highcharts={Highcharts} options={options} />
        </Box>
    );
};

export default MeasurementLineChart;
