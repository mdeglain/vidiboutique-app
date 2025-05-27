import React, { useState } from "react"

import { IconButton, Popover, styled, Typography } from "@mui/material"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdSaveAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { CiCircleList } from "react-icons/ci";
import { FaListUl } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { AiOutlineOrderedList } from "react-icons/ai";

import axios from "@/libs/axios";

import { addProduct } from "@/features/basket/basket.slice"
import { selectIsAuth } from "@/features/auth/auth.selector";

import { eur } from "@/utils/format"
import toast from "react-hot-toast";
import { selectDefaultOrders } from "@/features/default-order/default-order.selector";
import { addItemToDefaultOrder } from "@/features/default-order/default-order.slice";


const Container = styled("div")({
    flex: 1,
    margin: "20px 40px",
})

const Title = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold,
}))

const Prices = styled('div')(({ theme }) => ({
    display: "flex",
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.bold,
    padding: "10px 0 20px 0",
    borderBottom: `1px solid ${theme.colors.grey[300]}`,
}))

const Price = styled("div")(({ theme }) => ({
    "&:last-child": {
        marginLeft: "10px",
        color: theme.colors.grey[400]
    }
}))

const Description = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.m,
    padding: "20px 0",
    textAlign: "justify"
}))

const Document = styled("div")(({ theme}) => ({
    fontSize: theme.fontSizes.m,
    textAlign: "justify",
    "& > a": {
        color: theme.colors.secondary,
        "&:hover": {
            textDecoration: "underline"
        }
    }
}))

const Actions = styled("div")({
    padding: "20px 0",
})

const NumberOfItemsContainer = styled("div")({
    display: "flex",
})

const Minus = styled("button")(({ theme }) => ({
    borderRadius: "99px 0 0 99px",
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "45px",
    height: "35px",
    padding: 0,
    border: "none",
    borderRight: `solid ${theme.colors.white} 1px`,

    "&:focus, &:hover": {
        outline: "none",
        border: "none"
    },
    "& > svg": {
        position: "relative",
        top: 2
    }
}))

const NumberOfItems = styled("input")(({ theme }) => ({
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "50px",
    height: "33px",
    lineHeight: "33px",
    textAlign: "center",
    fontWeight: theme.fontWeights.bold,
    border: "none",
}))

const Plus = styled("button")(({ theme }) => ({
    borderRadius: "0 99px 99px 0",
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "45px",
    height: "35px",
    padding: 0,
    border: "none",
    borderLeft: `solid ${theme.colors.white} 1px`,

    // Focus + hover selector
    "&:focus, &:hover": {
        outline: "none",
        border: "none"
    },
    "& > svg": {
        position: "relative",
        top: 2
    }
}))

const AddToCart = styled("button")(({ theme, disabled }) => ({
    height: 35,
    borderRadius: 99,
    // backgroundColor: theme.colors.primary,
    border: `solid ${disabled ? "#eeeeee" : theme.colors.primary} 1px`,
    fontSize: theme.fontSizes.m,
    backgroundColor: disabled ? "#eeeeee" : theme.colors.primary,
    color: disabled ? theme.colors.black : theme.colors.white,
    marginTop: 20,

    "&:focus, &:hover": {
        outline: "none",
        border: `solid ${disabled ? "#eeeeee" : theme.colors.primary} 1px`,
        cursor: disabled ? "not-allowed" : "pointer"
    },
    "&:not(:disabled)&:focus, &:not(:disabled)&:hover": {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        color: theme.colors.white
    }
}))

const FavoriteContainer = styled(IconButton)(({ theme }) => ({
    width: 40,
    height: 40,
    marginLeft: 10,
    "& .MuiIconButton-root": {
        border: "none",
        "&:focus, &:focus-visible": {
            outline: "none"
        }
    }
}))

// const AddToFavorite = styled(AiOutlineHeart)(({ theme }) => ({
//     color: theme.colors.primary,
// }))

const Supplier = styled('div')(({ theme }) => ({
    paddingTop: "20px",
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
}))

const Code = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
    borderBottom: `1px solid ${theme.colors.grey[300]}`,
    paddingBottom: 20,
}))

const MuiOutlineHeart = styled(AiOutlineHeart)(({ theme }) => ({
    color: theme.colors.primary,
    "&:hover": {
        color: theme.colors.orange
    }
}));
const MuiAiOutlineOrderedList = styled(AiOutlineOrderedList)(({ theme }) => ({
    color: theme.colors.primary,
    "&:hover": {
        color: theme.colors.orange
    }
}));

const MuiFillHeart = styled(AiFillHeart)(({ theme }) => ({
    color: theme.colors.orange
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



export const Informations = ({ product, setProduct }) => {
    const isAuth = useSelector(selectIsAuth)
    const defaultOrders = useSelector(selectDefaultOrders)
    const dispatch = useDispatch()

    const [numberOfItems, setNumberOfItems] = useState(1)
    const [anchorEl, setAnchorEl] = useState(null);


    const addToCard = () => {
        axios.post("/carts-items", {
            public_id: product.public_id,
            quantity: numberOfItems
        }).then(response => {
            dispatch(addProduct(response.data.data))
            toast.success("Produit ajouté au panier")
        })
    }

    const onFavoriteClick = (e) => {
        e.stopPropagation()
        
        if (product.is_favorite) {
            axios.delete("/users-favorite-products", { data: { product_id: product.id } })
            .then(_ => {
                setProduct({...product, is_favorite: false })
            })
        } else {
            axios.post("/users-favorite-products", { product_id: product.id })
            .then(_ => {
                setProduct({...product, is_favorite: true })
            })
        }
        // axios.
    }

    const addToDefaultOrder = (order) => {
        axios.post(`/default-orders/${order.public_id}/items`, {
            product_id: product.id,
            quantity: numberOfItems
        }).then(response => {
            dispatch(addItemToDefaultOrder({ orderId: order.public_id, item: response.data.data}))
            setAnchorEl(null)
            toast.success("Produit ajouté au panier")
        }).catch(error => {
            toast.error("Une erreur est survenue")
        })
    }
    return (
        <Container>
            <Title>{product.name}</Title>
            {isAuth ? (
                <Prices>
                    <Price>{eur(product.price)} HT</Price>
                    <Price>{eur(product.price * (1 + product.tva.value))} TTC</Price>
                </Prices>
            ) : null}
            <Description>{product.short_description}</Description>
            {product.technical_sheet_link ? <Document>Fiche technique: <a about="blank_" href={product.technical_sheet_link}>cliquez ici</a></Document> : null}
            {product.security_sheet_link ? <Document>Fiche de sécurité: <a about="blank_" href={product.security_sheet_link}>cliquez ici</a></Document> : null}
            <Supplier>VENDEUR : {product.supplier.name}</Supplier>
            <Code>REF : {product.code}</Code>
            <Actions>
                <NumberOfItemsContainer>
                    <Minus onClick={() => setNumberOfItems(numberOfItems > 1 ? numberOfItems - 1 : 1)}><FaMinus /></Minus>
                    <NumberOfItems value={numberOfItems} onChange={(e) => {
                        if (e.target.value === "") {
                            return setNumberOfItems(1)
                        } else if (e.target.value === "0") {
                            return setNumberOfItems(1)
                        } else if (isNaN(parseInt(e.target.value))) {
                            return setNumberOfItems(1)
                        } else {
                            setNumberOfItems(parseInt(e.target.value))
                        }
                    }} />
                    <Plus onClick={() => setNumberOfItems(numberOfItems + 1)}><FaPlus /></Plus>
                </NumberOfItemsContainer>
                {product.is_available ? <AddToCart onClick={addToCard}>Ajouter au panier</AddToCart> : <AddToCart disabled>Produit indisponible</AddToCart>}
                <FavoriteContainer>
                    <IconButton style={{ width: 40, height: 40 }} onClick={e => onFavoriteClick(e)}>
                        {product.is_favorite ? <MuiFillHeart /> : <MuiOutlineHeart />}
                    </IconButton>
                </FavoriteContainer>
                <FavoriteContainer>
                    <IconButton style={{ width: 40, height: 40 }} onClick={e => setAnchorEl(e.currentTarget)}>
                        <MuiAiOutlineOrderedList />
                    </IconButton>
                </FavoriteContainer>
            </Actions>
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
                            <PopoverElement key={order.public_id} onClick={() => addToDefaultOrder(order)}>{order.name}</PopoverElement>
                        ))}
                    </PopoverContent>
            </Popover>
        </Container>
    )
}