import { useEffect, useState } from 'react';

import { loadAllDefaultThemes } from './load-default-themes';
import { createTheme } from '@mui/material';

export const useTheme = () => {
    const themes = loadAllDefaultThemes();
    const [theme, setTheme] = useState(createTheme({ ...themes.data.light }));
    const [themeLoaded, setThemeLoaded] = useState(false);


    const setMode = (mode) => {
        setTheme(createTheme({ ...themes.data[mode] }));
    };

    const getFonts = () => {
        const allFonts = []
        for (const key of Object.keys(themes.data)) {
            allFonts.push(...Object.values(themes.data[key].fonts))
        }
        return Array.from(new Set(allFonts));
    }

    useEffect(() => {
        setTheme(createTheme({ ...themes.data.light }));
        setThemeLoaded(true);
    }, []);

    return { theme, themeLoaded, setMode, getFonts };
};