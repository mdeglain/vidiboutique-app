import React from "react";
import { styled } from "@mui/material"

import { Checkout, ProductList } from "./components"
import { useLocation, useParams } from "react-router-dom";
import axios from "@/libs/axios";


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


export const Order = (props) => {
    const { orderId } = useParams()
    const { state } = useLocation()

    const isAdmin = state?.isAdmin || false
    const [order, setOrder] = React.useState(null)

    React.useEffect(() => {
        axios.get(`/orders/${orderId}`).then((response) => {
            setOrder(response.data.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    , [])

    return (
        <CartWrapper>
            <InnerCard>
                <ProductList order={order} setOrder={setOrder} />
                <Checkout isEditable={order?.status === "PENDING" && isAdmin} order={order} setOrder={setOrder}/>
            </InnerCard>
        </CartWrapper>
    )
}