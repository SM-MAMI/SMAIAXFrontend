import Highcharts from 'highcharts';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

const useCustomHighchartsTheme = () => {
    const theme = useTheme();

    useEffect(() => {
        Highcharts.setOptions({
            chart: {
                backgroundColor: theme.palette.background.paper,
                style: {
                    fontFamily: theme.typography.fontFamily,
                },
            },
            title: {
                style: {
                    color: theme.palette.text.primary,
                    fontSize: String(theme.typography.h5.fontSize),
                    fontWeight: String(theme.typography.h5.fontWeight),
                },
            },
            subtitle: {
                style: {
                    color: theme.palette.text.secondary,
                    fontSize: theme.typography.subtitle2.fontSize,
                    fontWeight: String(theme.typography.subtitle2.fontWeight),
                },
            },
            xAxis: {
                lineColor: theme.palette.divider,
                labels: {
                    style: {
                        color: theme.palette.text.primary,
                        fontSize: theme.typography.body2.fontSize,
                    },
                },
                title: {
                    style: {
                        color: theme.palette.text.primary,
                        fontSize: theme.typography.subtitle1.fontSize,
                        fontWeight: String(theme.typography.subtitle1.fontWeight),
                    },
                },
            },
            yAxis: {
                gridLineColor: theme.palette.divider,
                labels: {
                    style: {
                        color: theme.palette.text.primary,
                        fontSize: theme.typography.body2.fontSize,
                    },
                },
                title: {
                    style: {
                        color: theme.palette.text.primary,
                        fontSize: theme.typography.subtitle1.fontSize,
                        fontWeight: String(theme.typography.subtitle1.fontWeight),
                    },
                },
            },
            legend: {
                itemStyle: {
                    color: theme.palette.text.primary,
                    fontSize: String(theme.typography.body2.fontSize),
                },
                itemHoverStyle: {
                    color: theme.palette.primary.main,
                },
            },
            tooltip: {
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                style: {
                    color: theme.palette.text.primary,
                    fontSize: theme.typography.body2.fontSize,
                },
            },
            plotOptions: {
                line: {
                    marker: {
                        lineColor: theme.palette.background.paper,
                    },
                },
            },
            colors: [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.info.main,
            ],
        });
    }, [theme]);
};

export default useCustomHighchartsTheme;
