import React from "react";
import styled from "styled-components"

import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa6";

import { toggleIsCategoryOpen as _toggleIsCategoryOpen } from "../../../features/filter/filter.slice";
import { saveFilter as _saveFilter, removeFilter as _removeFilter} from "../../../features/filter/filter.slice";


const Container = styled.div`
    position: absolute;
    bottom: 0;
    height: 60px;
    display: flex;
    width: 100%;
    border-top: solid 1px ${props => props.theme.colors.grey[300]};
    background-color: ${props => props.theme.colors.white}
`

const CancelButton = styled.button`
    flex: 1;
    margin: auto 10px;
    height: 35px;
    font-size: ${props => props.theme.fontSizes.m};
    border: solid ${props => props.theme.colors.black} 2px;
    border-radius: 9999px;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    transition: transform 50ms;
    padding: 7px 5px !important;

    &:hover, &:active, &:focus, &focus-visible {
        border: solid ${props => props.theme.colors.black} 2px !important;
        outline: none;
    }
    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3019607843), 0px 4px 8px 3px rgba(0,0,0,.1490196078);
    }
`

const BackButton = styled.button`
    flex: 1;
    margin: auto 10px;
    position: relative;
    height: 35px;
    font-size: ${props => props.theme.fontSizes.m};
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    padding: 7px 5px !important;
    border: none;

    &:hover, &:active, &:focus, &focus-visible {
        border: none;
        outline: none;
    }

    & > .left-arrow {
        // float: left;
        position: absolute;
        top: 10px;
        left: calc(50% - 14px - 30px);

        width: 14px;
        height: 14px;
        transition: left 100ms ease-in-out;
    }
    &:hover > .left-arrow {
        position: absolute;
        top: 10px;
        left: calc(50% - 14px - 33px);

        width: 14px;
        height: 14px;
    }
`

const ApplyButton = styled.button`
    flex: 1;
    margin: auto 10px;
    height: 35px;
    font-size: ${props => props.theme.fontSizes.m};
    border: solid ${props => props.theme.colors.secondary} 2px;
    border-radius: 9999px;
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.white};
    transition: transform 50ms;
    padding: 7px 5px !important;

    &:hover, &:active, &:focus, &focus-visible {
        border: solid ${props => props.theme.colors.secondary} 2px !important;
        outline: none;
    }
    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3019607843), 0px 4px 8px 3px rgba(0,0,0,.1490196078);
    }
`

export const ActionButtons = () => {
    const dispatch = useDispatch()
    const toggleIsCategoryOpen = () => dispatch(_toggleIsCategoryOpen())
    const saveFilter = () => dispatch(_saveFilter())
    const removeFilter = () => dispatch(_removeFilter())
    const isCategoryOpen = useSelector(state => state.filter.isCategoryOpen)
    return (
        <Container>
            {
                isCategoryOpen ?
                    <BackButton onClick={toggleIsCategoryOpen}>
                        <FaArrowLeft className="left-arrow" />
                        <span>Retour</span>
                    </BackButton>
                    :
                    <CancelButton onClick={removeFilter}>Annuler</CancelButton>

            }
            <ApplyButton onClick={saveFilter}>Appliquer</ApplyButton>
        </Container>
    )
}