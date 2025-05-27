import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';

import { Product } from "./product"

const ProductsWrapper = styled("div")(({ theme }) => ({
    "& > div:not(:last-child)": {
        borderBottom: `solid ${theme.colors.grey[300]} 1px`,
    }
}))

export const ProductList = (props) => {
    const cartItems = useSelector(state => state.basket.products)
    return (
        <ProductsWrapper>
            {
                cartItems.map((cartItem, index) => {
                    return <Product cartItem={cartItem} key={index} />
                })
            }
        </ProductsWrapper>
    )
}