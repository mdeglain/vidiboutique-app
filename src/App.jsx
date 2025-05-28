import React, { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { styled } from "@mui/system"
import WebFront from 'webfontloader';
import { Provider } from 'react-redux';

import { persistor, store } from '@/store/store';
import { ThemeContext } from './contexts/theme-context';

import { GlobalStyles } from './themes/global-style'
import { useTheme } from './themes/useTheme';

import { Header, Footer } from './layouts';
import { LoginModal } from './components';

import { Router } from "./Router"
import { SearchRedirect } from './components/search-component/search-component';
// import { injectStore } from './libs/axios'; // Removed as axios.js is deleted

import { GetDefaultData } from './components/get-default-data/get-default-data';
import { Toaster } from 'react-hot-toast';



const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
})

const Content = styled('div')({
    overflow: 'scroll',
    margin: '20px 20px calc(417px + 20px) 20px',
    width: 'calc(100% - 40px)',
})

const app = () => {


    const { theme, themeLoaded, getFonts } = useTheme();
    const [selectedTheme, setSelectTheme] = useState(theme);
    // injectStore(store); // Removed

    useEffect(() => {
        setSelectTheme(theme);
    }, [themeLoaded])

    useEffect(() => {
        WebFront.load({
            google: {
                families: getFonts()
            }
        });
    }, []);

    return (
        <>
            {
                themeLoaded &&
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeContext.Provider value={selectedTheme}>
                            <MuiThemeProvider theme={selectedTheme}>
                                <ThemeProvider theme={selectedTheme}>
                                    <GlobalStyles />
                                    <Container>
                                        <GetDefaultData />
                                        <SearchRedirect />
                                        <Header />
                                        <LoginModal />
                                        <Content>
                                            <Router />
                                        </Content>
                                        <Footer />
                                        <div><Toaster
                                            position="bottom-right"
                                            reverseOrder={true}
                                        /></div>
                                    </Container>
                                </ThemeProvider>
                            </MuiThemeProvider>
                        </ThemeContext.Provider>
                    </PersistGate>
                </Provider>
            }
        </>
    );
}

export default app;