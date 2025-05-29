import React from "react";
import { styled, CircularProgress, Typography, Box } from "@mui/material"; // Added CircularProgress, Typography, Box

import { Checkout, ProductList } from "./components";
import { useLocation, useParams } from "react-router-dom";
// import axios from "@/libs/axios"; // Removed axios
import { useGetOrderByIdQuery } from "@/features/order/orderApi"; // RTK Query hook

const CartWrapper = styled('div')({
    flex: 1,
    color: "black", // Changed for better visibility on default white background
    textAlign: "center",
    padding: "20px",
})

const InnerCard = styled('div')({
    width: "80%", // Adjusted width
    border: "solid #e0e0e0 1px", // Lighter border
    borderRadius: "8px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#fff", // Added background color
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Added shadow
})


export const Order = (props) => {
    const { orderId } = useParams();
    const { state } = useLocation();
    const isAdmin = state?.isAdmin || false;

    const { data: order, isLoading, isError, error: queryError } = useGetOrderByIdQuery(orderId);

    if (isLoading) {
        return <CartWrapper><CircularProgress /></CartWrapper>;
    }

    if (isError) {
        return (
            <CartWrapper>
                <Typography color="error">
                    Erreur: {queryError?.data?.message || queryError?.message || 'Impossible de charger la commande.'}
                </Typography>
            </CartWrapper>
        );
    }
    
    if (!order) {
        return <CartWrapper><Typography>Aucune donnée de commande disponible.</Typography></CartWrapper>;
    }

    return (
        <CartWrapper>
            <InnerCard>
                {/* Assuming ProductList primarily displays items from the order. 
                    If it needs to modify the order, those functionalities would need to be refactored
                    perhaps by passing specific mutation triggers or by ProductList using its own hooks.
                    For now, removing setOrder as direct state manipulation is replaced by RTK Query's cache updates.
                */}
                <ProductList order={order} parentOrderId={order?.public_id} /> {/* Removed setOrder prop */}
                <Checkout 
                    isEditable={order?.status === "PENDING" && isAdmin} 
                    order={order} 
                    // setOrder prop removed. If Checkout needs to update the order, 
                    // it will use its own mutation hook or be passed a specific update function.
                />
            </InnerCard>
        </CartWrapper>
    )
}