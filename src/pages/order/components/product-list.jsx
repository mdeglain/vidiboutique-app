import React from 'react';
import { styled } from '@mui/material';

import { Product } from "./product"

const ProductsWrapper = styled("div")(({ theme }) => ({
    "& > div:not(:last-child)": {
        borderBottom: `solid ${theme.colors.grey[300]} 1px`,
    }
}))

export const ProductList = ({ order, setOrder }) => {
    return (
        <ProductsWrapper>
            {
                order?.order_items.map((orderItem, index) => {
                    return <Product isEditable={order.status === "PENDING"} orderItem={orderItem} setOrder={setOrder} key={index} />
                })
            }
        </ProductsWrapper>
    )
}