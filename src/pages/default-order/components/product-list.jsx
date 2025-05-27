import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';

import { Product } from "./product"

const ProductsWrapper = styled("div")(({ theme }) => ({
    "& > div:not(:last-child)": {
        borderBottom: `solid ${theme.colors.grey[300]} 1px`,
    }
}))

export const ProductList = ({ defaultOrder, items }) => {
    return (
        <ProductsWrapper>
            {
                items.map((item, index) => {
                    return <Product defaultOrder={defaultOrder} item={item} key={index} />
                })
            }
        </ProductsWrapper>
    )
}