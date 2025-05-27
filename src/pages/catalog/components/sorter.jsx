import React from "react";
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux";
import { toggleModal as _toggleModal, handleSortType, handleSortValue, selectSort } from "@/features/filter/filter.slice";

import { BsSortDownAlt, BsSortUpAlt } from "react-icons/bs"

const Button = styled.button`
    display: flex;
    justify-content: center;
    width: 35px;
    height: 35px;
    font-size: ${props => props.theme.fontSizes.m};
    border: solid ${props => props.theme.colors.primary} 2px;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    transition: transform 50ms;
    margin: 10px;
    padding: 5px 5px !important;


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

const Flex = styled.div`
    display: flex
`
const Select = styled.select`
    height: 35px;
    margin: 10px 0px 10px 5px;
    font-size: ${props => props.theme.fontSizes.m};
    border: solid ${props => props.theme.colors.primary} 2px;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    padding: 5px 5px !important;
    border-radius: 4px;
`

export const Sorter = () => {
    const dispatch = useDispatch()
    const sort = useSelector(selectSort)

    return (
        <Flex>
            <Select value={sort.value} onChange={e => dispatch(handleSortValue(e.target.value))}>
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="supplier">Fournisseur</option>
            </Select>
            <Button onClick={() => dispatch(handleSortType())}>
                {sort.type === "down" ? <BsSortDownAlt style={{ width: 22, height: 22 }} /> : <BsSortUpAlt style={{ width: 22, height: 22 }} />}
            </Button>
        </Flex>
    )
}