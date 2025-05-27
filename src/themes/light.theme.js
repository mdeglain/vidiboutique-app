import { theme as DefaultTheme } from './default.theme';

export const theme = {
    ...DefaultTheme,
    name: 'light',
    colors: {
        ...DefaultTheme.colors,
        primary: '#2A337D',
        secondary: '#6BBEA2',
        greyBackground: "#EFEEF5",
        orange: "#FE5000",

        button: {
            primary: '#222529',
            secondary: '#ffffff',
            hover: '#31373d'
        }
    },
};