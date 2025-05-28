import React, { useEffect, useState } from "react";
import { styled, Button as MuiButton, CircularProgress, Typography, Box } from "@mui/material"; // Added Button, CircularProgress, Typography, Box for UI feedback

import { Checkout, ProductList, OrderName } from "./components";
import { useParams } from "react-router-dom";
// import axios from "@/libs/axios"; // Removed axios
// import { useSelector } from "react-redux"; // Removed useSelector
// import { selectDefaultOrders } from "@/features/default-order/default-order.selector"; // Removed selector
import { useGetDefaultOrderByIdQuery, useUpdateDefaultOrderMutation } from "@/features/default-order/defaultOrderApi";
import toast from "react-hot-toast";


const Wrapper = styled('div')({
    flex: 1,
    color: "black", // Changed to black for better visibility on default white background
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

const SaveButtonContainer = styled(Box)({
    marginTop: '20px',
    textAlign: 'right',
});

export const DefaultOrder = (props) => {
    const { orderId: defaultOrderId } = useParams(); // Renamed for clarity
    
    const { data: initialOrderData, isLoading, isError, error: queryError } = useGetDefaultOrderByIdQuery(defaultOrderId);
    const [order, setOrder] = useState(null);
    const [updateDefaultOrder, { isLoading: isSaving }] = useUpdateDefaultOrderMutation();

    useEffect(() => {
        if (initialOrderData) {
            // Ensure items is always an array, even if null/undefined from API
            setOrder({ ...initialOrderData, items: initialOrderData.items || [] });
        }
    }, [initialOrderData]);

    const handleNameChange = (newName) => {
        setOrder(prevOrder => prevOrder ? { ...prevOrder, name: newName } : null);
    };

    const handleAddItem = (item) => {
        setOrder(prevOrder => {
            if (!prevOrder) return null;
            const existingItem = prevOrder.items.find(i => i.product_id === item.product_id);
            if (existingItem) {
                // Optionally update quantity or just return prevOrder if duplicates aren't allowed / handled differently
                return {
                    ...prevOrder,
                    items: prevOrder.items.map(i =>
                        i.product_id === item.product_id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
                    ),
                };
            }
            return { ...prevOrder, items: [...prevOrder.items, item] };
        });
    };

    const handleUpdateItemQuantity = (productId, newQuantity) => {
        setOrder(prevOrder => {
            if (!prevOrder) return null;
            if (newQuantity <= 0) { // Assuming quantity cannot be zero or negative, effectively deleting if so
                return { ...prevOrder, items: prevOrder.items.filter(item => item.product_id !== productId) };
            }
            return {
                ...prevOrder,
                items: prevOrder.items.map(item =>
                    item.product_id === productId ? { ...item, quantity: newQuantity } : item
                ),
            };
        });
    };

    const handleDeleteItem = (productId) => {
        setOrder(prevOrder => prevOrder ? { ...prevOrder, items: prevOrder.items.filter(item => item.product_id !== productId) } : null);
    };

    const handleSaveChanges = async () => {
        if (!order) return;
        // The API expects 'id' for the order, but we have 'public_id' or 'defaultOrderId' from the route.
        // Assuming the order object from `useGetDefaultOrderByIdQuery` has the correct 'id' field needed for the update.
        // If the API expects `public_id` to be sent as `id`, then ensure `order.id` is `order.public_id`.
        // For now, let's assume `order.id` is what the `updateDefaultOrder` mutation expects.
        // The API also expects items to be an array of objects with product_id and quantity.
        const payload = {
            id: order.id, // Ensure this is the correct identifier for the API
            name: order.name,
            items: order.items.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
            // include other fields like user_id if necessary and available
        };

        try {
            await updateDefaultOrder(payload).unwrap();
            toast.success("Commande par défaut sauvegardée !");
        } catch (err) {
            toast.error(err?.data?.message || "Erreur lors de la sauvegarde.");
        }
    };

    if (isLoading) {
        return <Wrapper><CircularProgress /></Wrapper>;
    }

    if (isError || !order && !isLoading) { // Added !order && !isLoading for case where data fetch completes but order is still null
        return <Wrapper><Typography color="error">Erreur: {queryError?.data?.message || queryError?.message || 'Impossible de charger la commande par défaut.'}</Typography></Wrapper>;
    }
    
    // Ensure order is not null before rendering children that depend on it
    if (!order) {
         return <Wrapper><Typography>Aucune donnée de commande disponible.</Typography></Wrapper>;
    }

    return (
        <Wrapper>
            <InnerCard>
                <OrderName 
                    initialName={order.name} 
                    publicId={order.public_id} 
                    onNameChange={handleNameChange} 
                />
                <ProductList 
                    items={order.items || []} 
                    onAddItem={handleAddItem} 
                    onUpdateItemQuantity={handleUpdateItemQuantity} 
                    onDeleteItem={handleDeleteItem}
                    // Pass defaultOrder if ProductList still needs other top-level order properties
                    // defaultOrder={order} 
                />
                <Checkout 
                    items={order.items || []} 
                    // defaultOrder={order} // Pass if Checkout needs other top-level order properties
                />
                <SaveButtonContainer>
                    <MuiButton variant="contained" color="primary" onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24} /> : "Sauvegarder les modifications"}
                    </MuiButton>
                </SaveButtonContainer>
            </InnerCard>
        </Wrapper>
    )
}