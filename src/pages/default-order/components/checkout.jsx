import React from "react"
import { styled } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ShippingCostAdvice } from "./shipping-cost-advice"

import { eur } from "@/utils/format"
import { calculateTotal, calculateShippingCosts } from "@/utils"
import axios from "@/libs/axios"
import toast from "react-hot-toast"
import { initCart } from "@/features/basket/basket.slice"

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

export const Checkout = ({ defaultOrder,items }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const saveToCart = () => {
        axios.post(`default-orders/${defaultOrder.public_id}/save-to-cart`).then(_ => {
            axios.get("carts").then(response => {
                dispatch(initCart(response.data.data.cart_items))
            }).then(_ => {
                navigate("/cart")
            })
        }).catch(err => {
            toast.error("Une erreur est survenue")
        })
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
                <Button onClick={saveToCart} disabled={items.length ? false : true}>Ajouter au panier</Button>
            </ButtonWrapper>
        </CheckoutWrapper>
    )
}