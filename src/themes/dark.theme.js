import { theme as DefaultTheme } from './default.theme';

export const theme = {
    ...DefaultTheme,
    name: 'dark',
    colors: {
        ...DefaultTheme.colors,
        primary: '#6c757d',
        secondary: '#007bff',
    },
};