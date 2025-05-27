import React, { useEffect } from "react";
import { styled } from "@mui/material"

import { Checkout, ProductList, OrderName } from "./components"
import { useParams } from "react-router-dom";
import axios from "@/libs/axios";
import { useSelector } from "react-redux";
import { selectDefaultOrders } from "@/features/default-order/default-order.selector";


const Wrapper = styled('div')({
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


export const DefaultOrder = (props) => {
    const params = useParams()
    const defaultOrderId = params.orderId
    const defaultOrders = useSelector(selectDefaultOrders)

    const order = defaultOrders.find(order => order.public_id === defaultOrderId)

    return (
        <Wrapper>
            <InnerCard>
                <OrderName orderName={order?.name} publicId={order?.public_id} />
                <ProductList defaultOrder={order} items={order?.items || []} />
                <Checkout defaultOrder={order} items={order?.items || []} />
            </InnerCard>
        </Wrapper>
    )
}