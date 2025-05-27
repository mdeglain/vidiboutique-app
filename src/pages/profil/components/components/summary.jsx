import React, { useContext, useState } from "react"
import { useSelector } from 'react-redux';
import { Checkbox, styled } from "@mui/material";

import { ThemeContext } from "@/contexts/theme-context"

import { Product } from "./product"
import { calculateTotal, calculateShippingCosts } from "@/utils"

import { eur } from "@/utils/format"


const SummaryWrapper = styled("div")(({ theme }) => ({
    flex: 2,
    padding: "20px 20px",
    display: "flex",
    flexDirection: "column",
    "& > div": {
        margin: "10px 0"
    }
}))

const Border = styled("div")(({ theme }) => ({
    margin: "0 20px",
    width: "100%",
    border: `2px solid ${theme.colors.grey[300]}`,
}))

const Content = styled("div")(({ theme }) => ({
    padding: "20px 20px",
}))

const Title = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
    marginBottom: "10px"
}))

const Subtitle = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
    paddingLeft: "10px"
}))

const Divider = styled("div")(({ theme }) => ({
    width: "100%",
    height: "1px",
    backgroundColor: theme.colors.grey[300],
    margin: "10px 0"
}))

const PriceWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0",
    paddingRight: "10px"
}))

const Price = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
}))

const GeneralConditions = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    fontSize: theme.fontSizes.m,
    margin: "10px 0",
}))

const Button = styled("button")(({ theme }) => ({
    width: "100%",
    height: "40px",
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: "5px",
    fontSize: theme.fontSizes.m,
    fontWeight: theme.fontWeights.bold,

    "&:disabled": {
        backgroundColor: theme.colors.grey[300],
        color: theme.colors.grey[500],
        cursor: "not-allowed"
    }
}))


export const Summary = ({ submit }) => {
    const theme = useContext(ThemeContext);
    const cartItems = useSelector(state => state.basket.products)

    const [isChecked, setIsChecked] = useState(false)

    const total_ht = calculateTotal(cartItems, false)
    const total_ttc = calculateTotal(cartItems, true)
    const shipping_costs = calculateShippingCosts(cartItems)
    const total = total_ttc + shipping_costs

    return (
        <SummaryWrapper>
            <Border>
                <Content>
                    <Title>Votre commande</Title>
                    <Subtitle>Produits</Subtitle>
                    <Divider />
                    {cartItems.map((cartItem) => {
                        return <Product key={cartItem.public_id} cartItem={cartItem} />
                    })}
                    <Divider />
                    <PriceWrapper>
                        <Subtitle>Total HT</Subtitle>
                        <Price>{eur(total_ht)}</Price>
                    </PriceWrapper>
                    <PriceWrapper>
                        <Subtitle>Total TTC</Subtitle>
                        <Price>{eur(total_ttc)}</Price>
                    </PriceWrapper>
                    <PriceWrapper>
                        <Subtitle>Frais de livraison</Subtitle>
                        <Price>{eur(shipping_costs)}</Price>
                    </PriceWrapper>
                    <Divider />
                    <PriceWrapper>
                        <Subtitle>Total</Subtitle>
                        <Price>{eur(total)}</Price>
                    </PriceWrapper>
                    <div style={{ fontSize: theme.fontSizes.s }}>
                        Vos données personnelles seront utilisées pour traiter votre commande,
                        soutenir votre expérience sur ce site Web et à d'autres fins décrites dans
                        <a href="https://vidiboutique.fr/politique-de-confidentialite/" target="_blank" style={{
                            color: theme.colors.secondary,
                            textDecoration: "none"
                        }}> notre politique de confidentialité.</a></div>
                    <GeneralConditions>
                        <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} size="small" />
                        <div onClick={() => setIsChecked(!isChecked)} style={{ cursor: "default" }}>J’ai lu et j’accepte les <a href="https://vidiboutique.fr/politique-de-confidentialite/" target="_blank" style={{
                            cursor: "pointer",
                            color: theme.colors.secondary,
                        }} >conditions générales</a> <abbr style={{ color: "#c10000" }}>*</abbr></div>
                    </GeneralConditions>
                    <Button disabled={!isChecked} onClick={submit} >Commander</Button>
                </Content>
            </Border>
        </SummaryWrapper>
    )
}