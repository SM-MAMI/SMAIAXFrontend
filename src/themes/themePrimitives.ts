import { alpha, createTheme, Shadows } from '@mui/material/styles';

const defaultTheme = createTheme();

export const brand = {
    50: 'hsl(210, 100%, 95%)',
    100: 'hsl(210, 100%, 92%)',
    200: 'hsl(210, 100%, 80%)',
    300: 'hsl(210, 100%, 65%)',
    400: 'hsl(210, 98%, 48%)',
    500: 'hsl(210, 98%, 42%)',
    600: 'hsl(210, 98%, 55%)',
    700: 'hsl(210, 100%, 35%)',
    800: 'hsl(210, 100%, 16%)',
    900: 'hsl(210, 100%, 21%)',
};

export const gray = {
    50: 'hsl(220, 35%, 97%)',
    100: 'hsl(220, 30%, 94%)',
    200: 'hsl(220, 20%, 88%)',
    300: 'hsl(220, 20%, 80%)',
    400: 'hsl(220, 20%, 65%)',
    500: 'hsl(220, 20%, 42%)',
    600: 'hsl(220, 20%, 35%)',
    700: 'hsl(220, 20%, 25%)',
    800: 'hsl(220, 30%, 6%)',
    900: 'hsl(220, 35%, 3%)',
};

export const green = {
    50: 'hsl(120, 80%, 98%)',
    100: 'hsl(120, 75%, 94%)',
    200: 'hsl(120, 75%, 87%)',
    300: 'hsl(120, 61%, 77%)',
    400: 'hsl(120, 44%, 53%)',
    500: 'hsl(120, 59%, 30%)',
    600: 'hsl(120, 70%, 25%)',
    700: 'hsl(120, 75%, 16%)',
    800: 'hsl(120, 84%, 10%)',
    900: 'hsl(120, 87%, 6%)',
};

export const orange = {
    50: 'hsl(30, 100%, 97%)',
    100: 'hsl(30, 94%, 90%)',
    200: 'hsl(30, 95%, 80%)',
    300: 'hsl(30, 92%, 65%)',
    400: 'hsl(30, 87%, 50%)',
    500: 'hsl(30, 83%, 45%)',
    600: 'hsl(30, 80%, 35%)',
    700: 'hsl(30, 75%, 30%)',
    800: 'hsl(30, 72%, 25%)',
    900: 'hsl(30, 70%, 20%)',
};

export const red = {
    50: 'hsl(0, 100%, 97%)',
    100: 'hsl(0, 92%, 90%)',
    200: 'hsl(0, 94%, 80%)',
    250: 'hsl(0, 90%, 73%)',
    300: 'hsl(0, 90%, 65%)',
    400: 'hsl(0, 90%, 40%)',
    500: 'hsl(0, 90%, 30%)',
    600: 'hsl(0, 91%, 25%)',
    700: 'hsl(0, 94%, 18%)',
    800: 'hsl(0, 95%, 12%)',
    900: 'hsl(0, 93%, 6%)',
};

export const colorSchemes = {
    light: {
        palette: {
            primary: {
                light: brand[200],
                main: brand[400],
                dark: brand[700],
                contrastText: brand[50],
            },
            info: {
                light: brand[100],
                main: brand[300],
                dark: brand[600],
                contrastText: gray[50],
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
            },
            success: {
                light: green[300],
                main: green[400],
                dark: green[800],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%, 99%)',
                paper: 'hsl(220, 35%, 97%)',
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: alpha(gray[200], 0.3),
            },
            baseShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    stickyHeader: {
                        backgroundColor: gray[100],
                    },
                },
            },
            MuiContainer: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'hsl(0, 0%, 99%)',
                        maxWidth: '1600px !important',
                    },
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'hsl(0, 0%, 99%)',
                        color: gray[800],
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: 'var(--mui-palette-baseShadow)',
                    },
                    columnHeaderRow: {
                        backgroundColor: gray[100] + ' !important',
                    },
                    cell: {
                        borderBottom: `1px solid ${alpha(gray[300], 0.6)}`,
                    },
                },
            },
        },
    },
    dark: {
        palette: {
            primary: {
                contrastText: brand[50],
                light: brand[300],
                main: brand[400],
                dark: brand[700],
            },
            info: {
                contrastText: brand[300],
                light: brand[500],
                main: brand[700],
                dark: brand[900],
            },
            warning: {
                light: orange[400],
                main: orange[500],
                dark: orange[700],
            },
            error: {
                light: red[200],
                main: red[250],
                dark: red[400],
            },
            success: {
                light: green[400],
                main: green[500],
                dark: green[700],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[700], 0.6),
            background: {
                default: gray[900],
                paper: 'hsl(220, 30%, 7%)',
            },
            text: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[400],
            },
            action: {
                hover: alpha(gray[600], 0.2),
                selected: alpha(gray[600], 0.3),
            },
            baseShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
        },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    stickyHeader: {
                        backgroundColor: gray[800],
                    },
                },
            },
            MuiContainer: {
                styleOverrides: {
                    root: {
                        backgroundColor: gray[900],
                        maxWidth: '1600px !important',
                    },
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#191c23',
                        color: 'hsl(0, 0%, 90%)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: 'var(--mui-palette-baseShadow)',
                    },
                    columnHeaderRow: {
                        backgroundColor: gray[800] + ' !important',
                    },
                    cell: {
                        borderBottom: `1px solid ${alpha(gray[700], 0.5)}`,
                    },
                },
            },
        },
    },
};

export const typography = {
    fontFamily: ['"Arial", "Helvetica", "sans-serif"'].join(','),
    h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
    },
    h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
    },
    h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
    },
    h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
    },
    subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
    },
    subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
    },
    body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
    },
    body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
    },
    caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
    },
};

export const shape = {
    borderRadius: 8,
};

const defaultShadows: Shadows = [...defaultTheme.shadows];
defaultShadows[1] = 'var(--mui-palette-baseShadow)';
export const shadows = defaultShadows;
