import React from "react"

import { styled } from "@mui/material"

import { eur } from "@/utils/format"
import { getProductsBySuppliers } from "@/utils/get-products-by-suppliers"

const ShippingCostAdviceWrapper = styled("div")(({ theme }) => ({
    width: "100%",
    paddingBottom: "20px",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottom: `solid ${theme.colors.grey[300]} 1px`,
}))

const ShippingCostAdviceText = styled("div")(({ theme }) => ({
    color: theme.colors.grey[500],
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.bold,
    textDecoration: "underline",
    // padding: "20px 20px",
}))

const ShippingCostAdvicePrice = styled("div")(({ theme }) => ({
    textAlign: "left",
    fontSize: theme.fontSizes.m,
    color: theme.colors.grey[500],
    "& span": {
        color: theme.colors.orange,
        fontWeight: theme.fontWeights.bold
    }
}))

export const ShippingCostAdvice = ({ items }) => {
    const calculateAdvices = () => {
        const productsBySuppliers = getProductsBySuppliers(items)

        const advices = []
        for (const supplierPublicId in productsBySuppliers) {
            const supplier = productsBySuppliers[supplierPublicId]
            const total = supplier.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
            const freeShippingCostsAmount = supplier.free_shipping_costs_amount

            if (total < freeShippingCostsAmount) {
                const remainingAmountForFreeShipping = freeShippingCostsAmount - total
                advices.push({
                    supplierName: supplier.name,
                    remainingAmountForFreeShipping: remainingAmountForFreeShipping,
                })
            }
        }
        return advices
    }

    const advices = calculateAdvices()
    return (
        <ShippingCostAdviceWrapper>
            <ShippingCostAdviceText>INFORMATIONS :</ShippingCostAdviceText>
            {advices.map(advice => {
                return (
                    <ShippingCostAdvicePrice>{advice.supplierName} : <span>{eur(advice.remainingAmountForFreeShipping)}</span> restants pour bénéficer des frais de livraison offerts</ShippingCostAdvicePrice>
                )
            })
            }
        </ShippingCostAdviceWrapper>
    )
}