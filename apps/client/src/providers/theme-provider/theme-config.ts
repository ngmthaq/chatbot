import { createTheme, type ThemeOptions } from '@mui/material/styles';

import type { ThemeMode } from '../../stores/theme-store';

export const createAppTheme = (mode: ThemeMode) => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: {
              main: '#1976d2',
              light: '#42a5f5',
              dark: '#1565c0',
            },
            secondary: {
              main: '#9c27b0',
              light: '#ba68c8',
              dark: '#7b1fa2',
            },
            background: {
              default: '#fafafa',
              paper: '#ffffff',
            },
            text: {
              primary: 'rgba(0, 0, 0, 0.87)',
              secondary: 'rgba(0, 0, 0, 0.6)',
            },
            // Custom colors for chat
            chat: {
              userBubble: '#e3f2fd',
              assistantBubble: '#f5f5f5',
              userText: 'rgba(0, 0, 0, 0.87)',
              assistantText: 'rgba(0, 0, 0, 0.87)',
            },
          }
        : {
            // Dark mode palette
            primary: {
              main: '#90caf9',
              light: '#e3f2fd',
              dark: '#42a5f5',
            },
            secondary: {
              main: '#ce93d8',
              light: '#f3e5f5',
              dark: '#ab47bc',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: 'rgba(255, 255, 255, 0.7)',
            },
            // Custom colors for chat
            chat: {
              userBubble: '#1e3a5f',
              assistantBubble: '#2a2a2a',
              userText: '#ffffff',
              assistantText: '#ffffff',
            },
          }),
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          margin: 'dense',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

// Extend theme interface for custom colors
declare module '@mui/material/styles' {
  interface Palette {
    chat: {
      userBubble: string;
      assistantBubble: string;
      userText: string;
      assistantText: string;
    };
  }
  interface PaletteOptions {
    chat?: {
      userBubble?: string;
      assistantBubble?: string;
      userText?: string;
      assistantText?: string;
    };
  }
}
