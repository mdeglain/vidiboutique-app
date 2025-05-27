import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

import LogoVidiBoutique from '../../assets/logo-vidi-boutique.png';
import { LogoWrapper, Logo } from './components';
import { SearchBar } from './components';
import { Menu } from './components';
import { useDispatch } from 'react-redux';
import { removeFilter } from '@/features/filter/filter.slice';

/*
** 1. Logo
** 2. Rechercher
** 3. Menu (Mon compte, S'identifier, Favoris, Panier)
*/

export const Wrapper = styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    width: 100%;
    background-color: ${props => props.theme.colors.white};
`

export const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <Wrapper>
            <LogoWrapper href="#" onClick={() => {
                dispatch(removeFilter())
                navigate(`/`)
            }}>
                <Logo src={LogoVidiBoutique} />
            </LogoWrapper>
            <SearchBar />
            <Menu />
        </Wrapper>
    );
}