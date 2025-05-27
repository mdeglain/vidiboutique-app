import { theme as DarkTheme } from './dark.theme';
import { theme as LightTheme } from './light.theme';

export const loadAllDefaultThemes = () => {
    return {
        data: {
            dark: DarkTheme,
            light: LightTheme,
        },
    };
}