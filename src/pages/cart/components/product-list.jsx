import React from 'react';
// import { useSelector } from 'react-redux'; // Removed useSelector
import { styled, CircularProgress, Typography } from '@mui/material'; // Added CircularProgress, Typography
import { useGetCartItemsQuery } from '@/features/cart/cartApi'; // RTK Query hook

import { Product } from "./product"

const ProductsWrapper = styled("div")(({ theme }) => ({
    "& > div:not(:last-child)": {
        borderBottom: `solid ${theme.colors.grey[300]} 1px`,
    }
}))

const MessageContainer = styled("div")({
    padding: "20px",
    textAlign: "center",
});

export const ProductList = (props) => {
    const { data: cartData, isLoading, isError, error } = useGetCartItemsQuery();
    
    // Adjust based on the actual structure of cartData. 
    // If cartData itself is the array: const cartItems = cartData || [];
    // If it's nested under 'data' and items are in 'data.data': const cartItems = cartData?.data?.data || [];
    // Based on cartApi.js, providesTags used result.data.map, suggesting items are in cartData.data
    const cartItems = cartData?.data || []; 

    if (isLoading) {
        return (
            <MessageContainer>
                <CircularProgress />
                <Typography>Chargement du panier...</Typography>
            </MessageContainer>
        );
    }

    if (isError) {
        return (
            <MessageContainer>
                <Typography color="error">
                    Erreur: {error?.data?.message || error?.message || 'Impossible de charger le panier.'}
                </Typography>
            </MessageContainer>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <MessageContainer>
                <Typography>Votre panier est vide.</Typography>
            </MessageContainer>
        );
    }

    return (
        <ProductsWrapper>
            {
                cartItems.map((cartItem, index) => {
                    // Ensure cartItem has a stable ID, preferably from the backend (e.g., cartItem.public_id)
                    return <Product cartItem={cartItem} key={cartItem.public_id || index} />
                })
            }
        </ProductsWrapper>
    )
}