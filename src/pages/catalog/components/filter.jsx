import React from "react";
import styled from "styled-components"
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from "react-redux";
import { toggleModal as _toggleModal } from "@/features/filter/filter.slice";

import { BsSliders } from "react-icons/bs"
import { FilterContent } from "./filter-content";
import { FilteredItems } from "./filtered-items";

const Button = styled.button`
    display: flex;
    justify-content: center;
    width: 110px;
    height: 35px;
    font-size: ${props => props.theme.fontSizes.m};
    border: solid ${props => props.theme.colors.primary} 2px;
    border-radius: 9999px;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    transition: transform 50ms;
    margin: 10px;
    padding: 7px 5px !important;


    & > span {
        margin: 0 3px;
    }

    &:hover, &:active, &:focus, &focus-visible {
        border: solid ${props => props.theme.colors.primary} 2px !important;
        outline: none;
    }
    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3019607843), 0px 4px 8px 3px rgba(0,0,0,.1490196078);
    }
`

export const Filter = () => {
    const dispatch = useDispatch()
    const toggleModal = () => dispatch(_toggleModal())

    const isModalOpen = useSelector(state => state.filter.isModalOpen)

    return (
        <>
            <Button onClick={toggleModal}>
                <span>
                    <BsSliders />
                </span>
                <span>Filtrer</span>
            </Button>
            <Drawer
                anchor="left"
                open={isModalOpen}
                onClose={toggleModal}
            >
                <FilterContent />
            </Drawer>
            <FilteredItems />
        </>
    )
}