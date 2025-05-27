import React, { useContext, useState } from "react";
import styled from "styled-components"
import { styled as muiStyled, Typography, FormControlLabel, Checkbox } from "@mui/material";
import Slider, { SliderThumb } from "@mui/material/Slider";

import { FaAngleRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    toggleIsCategoryOpen as toggleIsCategoryOpenStore,
    toggleCheckbox as _toggleCheckbox,
    handlePriceChange as _handlePriceChange
} from "@/features/filter/filter.slice";

import { ThemeContext } from "@/contexts/theme-context";

const Title = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.title
}))


const Subtitle = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.m,
    marginTop: theme.space.large,
    marginBottom: theme.space.medium,
    fontWeight: theme.fontWeights.medium,
}))

const Price = styled('span')(({ theme }) => ({
    fontSize: theme.fontSizes.s,
}))

const CategoryButton = styled('button')(({ theme }) => ({
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    width: '100%',
    border: 'solid black 2px',
    borderRadius: '999px',
    padding: theme.space.medium,
    fontSize: theme.fontSizes.s,
    marginRight: theme.space.medium,
    marginBottom: theme.space.medium,
    cursor: 'pointer',
    textAlign: 'left',
    '&:hover': {
        borderColor: 'black',
        boxShadow: '0 0 10px 0px rgba(0,0,0,0.25)',
    },
    '&:focus': {
        outline: 'none',
    },
    '& > .right-arrow': {
        float: 'right',
        marginTop: theme.space.xsmall,
        width: '14px',
        height: '14px',
    }

}))

const ChecboxWrapper = styled('div')(({ theme }) => ({
    paddingLeft: 10
}))

const VidiSlider = muiStyled(Slider)(({ theme }) => ({
    color: theme.colors.primary,
    height: 3,
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 21,
        width: 21,
        backgroundColor: theme.colors.white,
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 5px rgba(0, 0, 0, 0.16)',
        },
        '& .vidi-bar': {
            height: 7,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 3,
    },
    '& .MuiSlider-rail': {
        color: theme.colors.grey[300],
        opacity: 1,
        height: 3,
    },
}))

function VidiThumbComponent(props) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <span className="vidi-bar" />
            <span className="vidi-bar" />
            <span className="vidi-bar" />
        </SliderThumb>
    );
}

export const FilterView = () => {
    const dispatch = useDispatch()
    const toggleIsCategoryOpen = () => dispatch(toggleIsCategoryOpenStore())
    const toggleCheckbox = (key) => dispatch(_toggleCheckbox(key))
    const handlePriceChange = (_, price) => dispatch(_handlePriceChange(price))

    const isReductionActivated = useSelector(state => state.filter.filters.isReductionActivated)
    const isFreeShippingActivated = useSelector(state => state.filter.filters.isFreeShippingActivated)
    const isVidiChoiceActivated = useSelector(state => state.filter.filters.isVidiChoiceActivated)
    const isBestSellsActivated = useSelector(state => state.filter.filters.isBestSellsActivated)
    const isFavoriteActivated = useSelector(state => state.filter.filters.isFavoriteActivated)
    const priceRange = useSelector(state => state.filter.filters.priceRange)


    const theme = useContext(ThemeContext);
    // const [price, setPrice] = useState(1000)

    // const handlePriceChange = (_, newValue) => {
    //     setPrice(newValue);
    // };

    return (
        <React.Fragment>
            <Title>Filtres</Title>
            <div>
                <Subtitle>Filtrer par catégorie</Subtitle>
                <CategoryButton onClick={toggleIsCategoryOpen}>
                    <span>Toutes les catégories</span>
                    <FaAngleRight className="right-arrow" />
                </CategoryButton>
            </div>
            <div>
                <Subtitle>Offres spéciales</Subtitle>
                <ChecboxWrapper>
                    <FormControlLabel
                        label={<Typography sx={{ fontSize: theme.fontSizes.m }}>Réductions</Typography>}
                        control={
                            <Checkbox
                                size="small"
                                checked={isReductionActivated}
                                onChange={() => toggleCheckbox({ "key": "isReductionActivated", "value": !isReductionActivated })}
                                sx={{
                                    padding: theme.space.small,
                                    color: theme.colors.primary,
                                    '&.Mui-checked': {
                                        color: theme.colors.primary
                                    }
                                }}
                            />
                        }
                    />
                </ChecboxWrapper>
                <ChecboxWrapper>
                    <FormControlLabel
                        label={<Typography sx={{ fontSize: theme.fontSizes.m }}>Envoi offert</Typography>}
                        control={
                            <Checkbox
                                size="small"
                                checked={isFreeShippingActivated}
                                onChange={() => toggleCheckbox({ "key": "isFreeShippingActivated", "value": !isFreeShippingActivated })}
                                sx={{
                                    padding: theme.space.small,
                                    color: theme.colors.primary,
                                    '&.Mui-checked': {
                                        color: theme.colors.primary
                                    }
                                }}
                            />
                        }
                    />
                </ChecboxWrapper>
            </div>
            <div>
                <Subtitle>Annotations</Subtitle>
                <ChecboxWrapper>
                    <FormControlLabel
                        label={
                            <Typography sx={{ fontSize: theme.fontSizes.m }}>Choix VIDI</Typography>}
                        control={
                            <Checkbox
                                size="small"
                                checked={isVidiChoiceActivated}
                                onChange={() => toggleCheckbox({ "key": "isVidiChoiceActivated", "value": !isVidiChoiceActivated })}
                                sx={{
                                    padding: theme.space.small,
                                    color: theme.colors.primary,
                                    '&.Mui-checked': {
                                        color: theme.colors.primary
                                    }
                                }}
                            />
                        }
                    />
                </ChecboxWrapper>
                <ChecboxWrapper>
                    <FormControlLabel
                        label={
                            <Typography sx={{ fontSize: theme.fontSizes.m }}>Meilleures ventes</Typography>
                        }
                        control={
                            <Checkbox
                                size="small"
                                checked={isBestSellsActivated}
                                onChange={() => toggleCheckbox({ "key": "isBestSellsActivated", "value": !isBestSellsActivated })}
                                sx={{
                                    padding: theme.space.small,
                                    color: theme.colors.primary,
                                    '&.Mui-checked': {
                                        color: theme.colors.primary
                                    }
                                }}
                            />
                        }
                    />
                </ChecboxWrapper>
                <ChecboxWrapper>
                    <FormControlLabel
                        label={
                            <Typography sx={{ fontSize: theme.fontSizes.m }}>Favoris</Typography>
                        }
                        control={
                            <Checkbox
                                size="small"
                                checked={isFavoriteActivated}
                                onChange={() => toggleCheckbox({ "key": "isFavoriteActivated", "value": !isFavoriteActivated })}
                                sx={{
                                    padding: theme.space.small,
                                    color: theme.colors.primary,
                                    '&.Mui-checked': {
                                        color: theme.colors.primary
                                    }
                                }}
                            />
                        }
                    />
                </ChecboxWrapper>
            </div>
            <div>
                <Subtitle>Prix (€): <Price>0€ - {priceRange["maximum"]}€</Price></Subtitle>
                <VidiSlider
                    slots={{ thumb: VidiThumbComponent }}
                    value={priceRange["maximum"]}
                    onChange={handlePriceChange}
                    min={0}
                    max={5000}
                />
            </div>
        </React.Fragment>
    )
}