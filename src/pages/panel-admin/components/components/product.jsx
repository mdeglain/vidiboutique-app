import React, { useContext } from "react"
import { styled } from "@mui/material"

import { ThemeContext } from "@/contexts/theme-context"
import { eur } from "@/utils/format"

const ProductWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",

    paddingLeft: "10px",
    fontSize: theme.fontSizes.m,
    "& > div": {
        lineHeight: "auto"
    }
}))


const Price = styled("div")(({ theme }) => ({
    // width: "10%",
    flex: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "right",
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
    paddingRight: "10px"
}))

export const Product = ({ cartItem }) => {
    const theme = useContext(ThemeContext);
    return (
        <ProductWrapper>
            <div style={{ flex: 8.5, width: "90%", color: theme.colors.orange }}>
                {cartItem.product.name} <strong>x {cartItem.quantity}</strong>
            </div>
            <Price>{eur(cartItem.product.price * cartItem.quantity)}</Price>
        </ProductWrapper>
    )
}