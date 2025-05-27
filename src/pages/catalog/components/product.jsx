import React, { useState } from "react"
import styled from "styled-components"
import { styled as muiStyled } from "@mui/system"
import { useDispatch, useSelector } from "react-redux"
import { IconButton, Popover } from "@mui/material"
import { AiOutlineHeart, AiFillHeart, AiOutlineOrderedList } from 'react-icons/ai'
import { SlBasket, SlBasketLoaded } from 'react-icons/sl'
import { useNavigate } from "react-router-dom";


import { selectIsAuth } from "@/features/auth/auth.selector"

import { eur } from "@/utils/format"
import axios from "@/libs/axios"
import { selectDefaultOrders } from "@/features/default-order/default-order.selector"
import toast from "react-hot-toast"
import { addItemToDefaultOrder } from "@/features/default-order/default-order.slice"


const Container = styled.div`
    cursor: pointer;
    @media only screen and (min-width: 0px) {
        flex-basis: 100%;
        max-width: 100%;
    }

    @media only screen and (min-width: 445px) {
        flex-basis: 50%;
        max-width: 50%;
    }
    
    @media only screen and (min-width: 640px) {
        flex-basis: 33.333333%;
        max-width: 33.333333%;
    }

    @media only screen and (min-width: 900px) {
        flex-basis: 25%;
        max-width: 25%;
    }

    transition: transform 50ms;

    &:hover {
        transform: scale(1.02);
    }
`

const InnerContainer = styled.div`
    width: auto;
    padding: 9px;
`


const ImageContainer = styled.div`
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.primary};
    background-color: transparent;
    position: relative;
    filter: grayscale(${ props => props.disabled ? "100%" : "0%"});
`

const NotAvailable = styled.div`
    position: absolute;
    right: 5px;
    top: 5px;
    background: ${props => `${props.theme.colors.danger}B6`};
    color: white;
    border-radius: 99px;
    font-size: ${props => props.theme.fontSizes.m};
    padding: 2px 7px;
`

const ImageWrapper = styled.div`
    width: 100%;
    aspect-ratio : 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Img = styled.img`
    max-width: calc(100% - 20px);
    max-height: calc(100% - 20px);
`

const Informations = styled.div`
    font-size: ${props => props.theme.fontSizes.s};
    `
const Title = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: ${props => props.theme.fontSizes.m};
`

const Prices = styled.div`
    display: flex;
    font-size: ${props => props.theme.fontSizes.l};
    font-weight: ${props => props.theme.fontWeights.bold};
`

const Price = styled.div`
    &:last-child {
        margin-left: 10px;
        color: ${props => props.theme.colors.grey[400]};
    }
`

const ActionsButton = styled.div`
    position: absolute;
    bottom: -3px;
    left: 0px;
    display: flex;
    justify-content: flex-end;
    transition: opacity 200ms;
    & .MuiIconButton-root {
        border: none;
        &:focus, &:focus-visible {
            outline: none;
        }
    }
`

const MuiOutlineHeart = styled(AiOutlineHeart)(({ theme }) => ({
    color: theme.colors.primary,
    "&:hover": {
        color: theme.colors.orange
    }
}));

const MuiFillHeart = styled(AiFillHeart)(({ theme }) => ({
    color: theme.colors.orange
}));

const MuiAiOutlineOrderedList = styled(AiOutlineOrderedList)(({ theme }) => ({
    color: theme.colors.primary,
    "&:hover": {
        color: theme.colors.orange
    }
}));

const PopoverContent = styled('div')(({ theme }) => ({
    backgroundColor: theme.colors.grey[100],
    padding: 5,
}))

const PopoverElement = styled('li')(({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.fontSizes.small,
    "&:hover": {
        color: theme.colors.orange,
        cursor: "pointer"
    }
}))

export const Product = ({ product, updateProducts }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth)
    const [anchorEl, setAnchorEl] = useState(null);
    const defaultOrders = useSelector(selectDefaultOrders)

    const onProductClick = () => {
        navigate(`/products/${product.public_id}`)
    }

    const onFavoriteClick = (e) => {
        e.stopPropagation()
        
        if (product.is_favorite) {
            axios.delete("/users-favorite-products", { data: { product_id: product.id } })
            .then(_ => {
                updateProducts({ id: product.id, newProduct: { ...product, is_favorite: false } })
            })
        } else {
            axios.post("/users-favorite-products", { product_id: product.id })
            .then(_ => {
                updateProducts({ id: product.id, newProduct: { ...product, is_favorite: true } })
            })
        }
    }

    const addToDefaultOrder = (order) => {
        axios.post(`/default-orders/${order.public_id}/items`, {
            product_id: product.id,
            quantity: 1
        }).then(response => {
            dispatch(addItemToDefaultOrder({ orderId: order.public_id, item: response.data.data}))
            setAnchorEl(null)
            toast.success("Produit ajouté au panier")
        }).catch(error => {
            toast.error("Ce produit est déjà dans cette commande")
        })
    }

    return (
        <Container key={product.public_id} onClick={onProductClick}>
            <InnerContainer>
                <ImageContainer disabled={!product.is_available}>
                    {!product.is_available && <NotAvailable>Produit indisponible</NotAvailable>}
                    <ImageWrapper>
                        <Img src={product.image_link} />
                    </ImageWrapper>
                    <ActionsButton>
                        <IconButton style={{ width: 40, height: 40 }} onClick={e => onFavoriteClick(e)}>
                            {product.is_favorite ? <MuiFillHeart /> : <MuiOutlineHeart />}
                        </IconButton>
                        <IconButton style={{ width: 40, height: 40 }} onClick={e => {
                            e.stopPropagation()
                            setAnchorEl(e.currentTarget)
                        }}>
                            <MuiAiOutlineOrderedList />
                        </IconButton>
                    </ActionsButton>
                </ImageContainer>
                <Informations>
                    <Title>{product.name}</Title>
                    {isAuth ? (
                        <Prices>
                            <Price>{eur(product.price)} HT</Price>
                            <Price>{eur(product.price * (1 + product.tva.value))} TTC </Price>
                        </Prices>
                    ) : null}
                </Informations>
            </InnerContainer>
            <Popover
                // id={id}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                >
                    <PopoverContent>
                        {defaultOrders.map(order => (
                            <PopoverElement key={order.public_id} onClick={(e) => {
                                e.stopPropagation()
                                addToDefaultOrder(order)
                            }}>{order.name}</PopoverElement>
                        ))}
                    </PopoverContent>
            </Popover>
        </Container>
    )
}