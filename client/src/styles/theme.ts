import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2E7D32',
            light: '#4CAF50',
            dark: '#1B5E20',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F9A825',
            dark: '#E65100',
            contrastText: '#1A1A18',
        },
        background: {
            default: '#FAFAF8',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A18',
            secondary: '#5D6B5E',
        },
        success: {
            main: '#4CAF50',
        },
        error: {
            main: '#D32F2F',
        },
        warning: {
            main: '#F9A825',
        },
        info: {
            main: '#0288D1',
        }
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: {
            fontSize: '48px',
            lineHeight: '52px',
            fontWeight: 700,
            color: '#1A1A18',
        },
        h2: {
            fontSize: '36px',
            lineHeight: '40px',
            fontWeight: 700,
            color: '#1A1A18',
        },
        h3: {
            fontSize: '24px',
            lineHeight: '30px',
            fontWeight: 600,
            color: '#1A1A18',
        },
        h4: {
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: 600,
        },
        h5: {
            fontSize: '18px',
            lineHeight: '24px',
            fontWeight: 500,
        },
        body1: {
            fontSize: '16px',
            lineHeight: '26px',
            color: '#1A1A18',
        },
        body2: {
            fontSize: '14px',
            lineHeight: '22px',
            color: '#5D6B5E',
        },
        caption: {
            fontSize: '12px',
            lineHeight: '18px',
            color: '#9E9E9B',
        },
        button: {
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            textTransform: 'none',
        }
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                :root {
                    --pantry-green-50: #F0FAF0;
                    --pantry-green-100: #C8EAC8;
                    --pantry-green-400: #4CAF50;
                    --pantry-green-600: #2E7D32;
                    --pantry-green-800: #1B5E20;
                    --pantry-amber-100: #FFF8E1;
                    --pantry-amber-400: #FFCA28;
                    --pantry-amber-600: #F9A825;
                    --pantry-amber-800: #E65100;
                    --pantry-white: #FFFFFF;
                    --pantry-cream: #FAFAF8;
                    --pantry-gray-100: #F5F5F3;
                    --pantry-gray-200: #EBEBEA;
                    --pantry-gray-400: #9E9E9B;
                    --pantry-gray-800: #1A1A18;
                    --pantry-organic: #558B2F;
                    --pantry-sale: #D32F2F;
                    --pantry-new: #0288D1;
                }
                * {
                    transition: all 0.18s ease;
                }
            `,
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    padding: '10px 24px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(46,125,50,0.15)',
                        transform: 'translateY(-2px)',
                    }
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    fontWeight: 600,
                }
            }
        }
    },
});
