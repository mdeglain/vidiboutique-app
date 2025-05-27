import React from "react"
import { styled } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";

import {
    toggleIsCategoryOpen as toggleIsCategoryOpenStore,
    toggleCheckbox as _toggleCheckbox,
    handlePriceChange as _handlePriceChange
} from "@/features/filter/filter.slice";

const Container = styled('div')(({ }) => ({
    display: 'flex',
    paddingLeft: '5px'
}))

const Item = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    // width: '110px',
    height: '31px',
    lineHeight: '31px',
    fontSize: theme.fontSizes.m,
    border: `solid ${theme.colors.primary} 2px`,
    borderRadius: '9999px',
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    transition: 'transform 50ms',
    margin: '5px',
    padding: '0px 5px !important',

    '& > span': {
        margin: '0 3px',
    },
    '& > .close': {
        cursor: 'pointer',
        position: 'relative',

        '& > svg': {
            color: theme.colors.primary,
            width: '16px',
            height: '16px',
            position: 'relative',
            top: '4px',
        }
    }
}))

export const FilteredItems = () => {
    const dispatch = useDispatch()
    const toggleCheckbox = (key) => dispatch(_toggleCheckbox(key))
    const handlePriceChange = (_, price) => dispatch(_handlePriceChange(price))

    const isReductionActivated = useSelector(state => state.filter.savedFilters.isReductionActivated)
    const isFreeShippingActivated = useSelector(state => state.filter.savedFilters.isFreeShippingActivated)
    const isVidiChoiceActivated = useSelector(state => state.filter.savedFilters.isVidiChoiceActivated)
    const isBestSellsActivated = useSelector(state => state.filter.savedFilters.isBestSellsActivated)
    const isFavoriteActivated = useSelector(state => state.filter.savedFilters.isFavoriteActivated)
    const isPriceActivated = useSelector(state => state.filter.savedFilters.isPriceActivated)
    const priceRange = useSelector(state => state.filter.savedFilters.priceRange)
    const activeCategoryId = useSelector(state => state.filter.savedFilters.activeCategoryId)
    const categories = useSelector(state => state.category.categories)

    const getActiveFilterValues = () => {
        const activeFilterValues = {}

        if (activeCategoryId) {
            const activeCategory = categories.find(category => category.id === activeCategoryId)
            activeFilterValues["activeCategoryId"] = activeCategory.name
        }
        if (isReductionActivated) {
            activeFilterValues["isReductionActivated"] = "Réduction"
        }
        if (isFreeShippingActivated) {
            activeFilterValues["isFreeShippingActivated"] = "Envoie offert"
        }
        if (isVidiChoiceActivated) {
            activeFilterValues["isVidiChoiceActivated"] = "Choix VIDI"
        }
        if (isBestSellsActivated) {
            activeFilterValues["isBestSellsActivated"] = "Meilleures ventes"
        }
        if (isFavoriteActivated) {
            activeFilterValues["isFavoriteActivated"] = "Favoris"
        }
        if (isPriceActivated) {
            activeFilterValues["isPriceActivated"] = `${priceRange.minimum}€ - ${priceRange.maximum}€`
        }
        return activeFilterValues
    }

    const removeFilter = (key) => {
        if (key === "isPriceActivated") {
            handlePriceChange(null, null)
        } else {
            toggleCheckbox({ "key": key, "value": null })
        }
    }

    const activeFilterValues = getActiveFilterValues()

    return (
        <Container>
            {Object.entries(activeFilterValues).map(elem => {
                const key = elem[0]
                const value = elem[1]
                return (
                    <Item>
                        <span>{value}</span>
                        <span className="close" onClick={() => removeFilter(key)}><IoMdClose /></span>
                    </Item>
                )
            })}
        </Container>
    )
}