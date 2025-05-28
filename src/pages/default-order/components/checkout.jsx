import React from "react"
import { styled } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ShippingCostAdvice } from "./shipping-cost-advice"

import { eur } from "@/utils/format"
import { calculateTotal, calculateShippingCosts } from "@/utils"
// import axios from "@/libs/axios" // Removed axios
import toast from "react-hot-toast"
// import { initCart } from "@/features/basket/basket.slice" // Removed initCart
import { useAddMultipleItemsToCartMutation } from "@/features/cart/cartApi"; // RTK Query hook

const CheckoutWrapper = styled("div")(({ theme }) => ({
    padding: "20px 0px",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "flex-end",
    borderTop: `solid ${theme.colors.grey[300]} 1px`,
}))

const TotalWrapper = styled("div")({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0px",
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
})

const PriceWrapper = styled("div")({
    display: "flex",
    // flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
})

const TotalText = styled("div")(({ theme }) => ({
    color: theme.colors.grey[500],
    fontSize: theme.fontSizes.xl,
    marginRight: "5px",
}))

const TotalPrice = styled("div")(({ theme }) => ({
    textAlign: "right",
    color: theme.colors.orange,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.xl,
}))

const ButtonWrapper = styled("div")({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
})

const Button = styled("button")(({ theme, disabled }) => ({
    backgroundColor: disabled ? theme.colors.grey : theme.colors.primary,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    "&:focus, &:hover": {
        outline: "none",
    }
}))

export const Checkout = ({ defaultOrder, items }) => { // items prop seems to be from parent default-order.jsx
    const navigate = useNavigate();
    // const dispatch = useDispatch(); // Removed if initCart was the only use

    const [addItemsToCart, { isLoading: isAddingMultipleItems }] = useAddMultipleItemsToCartMutation();

    const saveToCart = () => {
        if (!defaultOrder || !defaultOrder.items || defaultOrder.items.length === 0) {
            toast.error("Aucun article dans cette commande par défaut.");
            return;
        }

        const itemsPayload = {
            items: defaultOrder.items.map(item => ({
                product_id: item.product_public_id || item.product.public_id, // Ensure correct product identifier
                quantity: item.quantity,
            })),
        };
        
        // The endpoint `default-orders/${defaultOrder.public_id}/save-to-cart` seems to be a specific backend action
        // that might do more than just add items to cart (e.g., clear default order, specific analytics).
        // The new `addMultipleItemsToCart` mutation POSTs to `/carts`.
        // If the backend logic of `/default-orders/.../save-to-cart` is crucial and different from just populating the cart,
        // then this refactoring might need a new specific mutation for that endpoint instead of using a generic "add multiple items".
        // For now, proceeding with the assumption that the goal is to replace the cart content with default order items.
        // If the old endpoint `default-orders/${defaultOrder.public_id}/save-to-cart` is still required,
        // a new mutation for it should be created.
        // This refactoring assumes we are replacing the old mechanism with addMultipleItemsToCart.

        addItemsToCart(itemsPayload)
            .unwrap()
            .then(() => {
                toast.success("Articles ajoutés au panier !");
                navigate("/cart");
                // Cart data will be refetched by components using useGetCartItemsQuery due to invalidation
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Erreur lors de l'ajout au panier.");
            });
    }

    const total_ht = calculateTotal(items, false)
    const total_ttc = calculateTotal(items, true)
    const shipping_costs = calculateShippingCosts(items)
    const total = total_ttc + shipping_costs

    return (
        <CheckoutWrapper>
            <ShippingCostAdvice items={items} />
            <TotalWrapper>
                <PriceWrapper>
                    <TotalText>Total HT :</TotalText>
                    <TotalPrice>{eur(total_ht)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Total TTC :</TotalText>
                    <TotalPrice>{eur(total_ttc)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Frais de livraison :</TotalText>
                    <TotalPrice>{eur(shipping_costs)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Total :</TotalText>
                    <TotalPrice>{eur(total)}</TotalPrice>
                </PriceWrapper>
            </TotalWrapper>
            <ButtonWrapper>
                <Button onClick={saveToCart} disabled={isAddingMultipleItems || items.length === 0}>
                    {isAddingMultipleItems ? "Ajout en cours..." : "Ajouter au panier"}
                </Button>
            </ButtonWrapper>
        </CheckoutWrapper>
    )
}