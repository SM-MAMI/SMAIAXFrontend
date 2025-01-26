import Highcharts from 'highcharts';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

declare module 'highcharts' {
    // noinspection JSUnusedGlobalSymbols
    interface ExportingButtonsContextButtonThemeOptions {
        states?: {
            hover?: Highcharts.SVGAttributes;
            select?: Highcharts.SVGAttributes;
        };
    }
}

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
            exporting: {
                buttons: {
                    contextButton: {
                        align: 'right',
                        verticalAlign: 'top',
                        x: 5,
                        symbolStroke: theme.palette.primary.main,
                        theme: {
                            fill: theme.palette.background.paper,
                            stroke: theme.palette.divider,
                            states: {
                                hover: {
                                    fill: theme.palette.action.hover,
                                    style: {
                                        boxShadow: theme.shadows[1],
                                    },
                                },
                                select: {
                                    fill: theme.palette.action.selected,
                                    style: {
                                        boxShadow: theme.shadows[1],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            navigation: {
                menuStyle: {
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[1],
                },
                menuItemStyle: {
                    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                    color: theme.palette.text.primary,
                    fontSize: String(theme.typography.body2.fontSize),
                    fontFamily: theme.typography.fontFamily,
                },
                menuItemHoverStyle: {
                    background: theme.palette.action.hover,
                    color: theme.palette.text.secondary,
                },
            },
        });

        const style = document.createElement('style');
        style.innerHTML = `
            .highcharts-data-table {
                max-height: 500px;
                overflow: auto;
            }
            .highcharts-data-table table {
                border-collapse: collapse;
                border-spacing: 0;
                background: ${theme.palette.background.paper};
                min-width: 100%;
                margin-top: ${theme.spacing(2)};
                font-family: ${String(theme.typography.fontFamily)};
                font-size: ${String(theme.typography.body2.fontSize)};
                color: ${theme.palette.text.primary};
            }
            .highcharts-data-table th, .highcharts-data-table td {
                border: 1px solid ${theme.palette.divider};
                padding: ${theme.spacing(1)};
                text-align: center;
            }
            .highcharts-data-table thead tr {
                background: ${theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800]};
                color: ${theme.palette.text.primary};
            }
            .highcharts-data-table tbody tr:nth-of-type(even) {
                background: ${theme.palette.action.hover};
            }
            .highcharts-data-table tbody tr:hover {
                background: ${theme.palette.action.selected};
            }
            .highcharts-data-table th:first-child,
            .highcharts-data-table td:first-child {
                min-width: 100px;
                width: 150px;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [theme]);
};

export default useCustomHighchartsTheme;
