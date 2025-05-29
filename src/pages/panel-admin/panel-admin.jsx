import React from "react";
import { styled } from "@mui/system"

// import axios from "@/libs/axios"; // Removed as unused

import { OrdersList } from "@/components"

const ProfilWrapper = styled('div')(({ theme }) => ({
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
    // width: '100%',
    margin: "20px",
    flex: 1,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: theme.radius.medium,
}));

const User = styled('div')(({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
    width: '100%',
    flex: 1,
}));

const Wrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
    flex: 1,
    borderTop: `1px solid ${theme.colors.primary}`,
    height: "fit-content",
}));

const Navbar = styled('div')(({ theme }) => ({
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    // minHeight: "500px",
    // height: "calc(100vh - 100px - 351px)",
    borderRight: `1px solid ${theme.colors.primary}`,
}));

const Content = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    // minHeight: "fit-content",
    // height: "fit-content",
    width: '100%',
    overflow: "scroll",
}));

const NavbarElement = styled('div')(({ theme, isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: "50px",
    width: '100%',
    cursor: "pointer",
    borderBottom: `1px solid ${theme.colors.primary}`,

    "&:hover": {
        backgroundColor: isActive ? theme.colors.primary : theme.colors.secondary,
        color: theme.colors.white,

    },
    backgroundColor: isActive ? theme.colors.primary : "transparent",
    color: isActive ? theme.colors.white : theme.colors.black,

}));


export const PanelAdmin = () => {
    const [activePage, setActivePage] = React.useState("orders")

    return (
        <ProfilWrapper>
            {/* <User>Nom de la personne</User> */}
            <Wrapper>
                <Navbar>
                    {/* <NavbarElement onClick={() => setActivePage("profil")} isActive={activePage === "profil"}>Profil</NavbarElement> */}
                    <NavbarElement onClick={() => setActivePage("orders")} isActive={activePage === "orders"}>Commandes</NavbarElement>
                    {/* <NavbarElement onClick={() => setActivePage("addresses")} isActive={activePage === "addresses"}>Adresses</NavbarElement> */}
                    {/* <NavbarElement onClick={() => setActivePage("settings")} isActive={activePage === "settings"}>Paramètres</NavbarElement> */}
                </Navbar>
                <Content>
                    {/* {activePage === 'profil' && <ProfilContent />} */}
                    {activePage === 'orders' && <OrdersList isAdmin={true} />}
                    {/* {activePage === 'addresses' && <AddressesContent />}
                    {activePage === 'settings' && <SettingsContent />} */}
                </Content>
            </Wrapper>
        </ProfilWrapper>
    )
}