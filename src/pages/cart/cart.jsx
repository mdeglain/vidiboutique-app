import React from "react";
import { styled } from "@mui/material"

import { Checkout, ProductList } from "./components"


const CartWrapper = styled('div')({
    flex: 1,
    color: "white",
    textAlign: "center",
})

const InnerCard = styled('div')({
    width: "70%",
    border: "solid black 1px",
    borderRadius: "8px",
    margin: "auto",
    padding: "0px 20px"
})


export const Cart = (props) => {
    return (
        <CartWrapper>
            <InnerCard>
                <ProductList />
                <Checkout />
            </InnerCard>
        </CartWrapper>
    )
}