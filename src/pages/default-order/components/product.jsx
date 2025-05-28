import React from 'react'
import { styled } from "@mui/material"
// import { useDispatch } from "react-redux" // Removed useDispatch

import { FaMinus, FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";

// import { deleteItemFromDefaultOrder, updateItemQuantity } from "@/features/default-order/default-order.slice" // Removed slice imports

import { eur } from "@/utils/format"
// import axios from '@/libs/axios'; // Removed axios
// import toast from 'react-hot-toast'; // Removed toast if not used directly for these actions
import { useNavigate } from 'react-router-dom';

const ProductWrapper = styled('div')({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0"
})

const Img = styled('img')({
    width: "100px",
    height: "100px",
    objectFit: "contain"
})

const Actions = styled("div")({
    padding: "20px 20px",
    display: "flex",
})

const NumberOfItemsContainer = styled("div")({
    display: "flex",
})

const Minus = styled("button")(({ theme }) => ({
    borderRadius: "4px 0 0 4px",
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "25px",
    height: "25px",
    padding: 0,
    border: `solid ${theme.colors.grey[300]} 1px`,
    borderRight: "none",

    "&:focus, &:hover": {
        outline: "none",
        borderColor: theme.colors.grey[300]
    },
    "& > svg": {
        position: "relative",
        top: 2,
        width: "14px",
        height: "14px",
    }
}))

const NumberOfItems = styled("div")(({ theme }) => ({
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "50px",
    height: "23px",
    lineHeight: "23px",
    textAlign: "center",
    fontWeight: theme.fontWeights.bold,
    border: `solid ${theme.colors.grey[300]} 1px`,
    borderRight: "none",
    borderLeft: "none",
}))

const Plus = styled("button")(({ theme }) => ({
    borderRadius: "0 4px 4px 0",
    backgroundColor: "#eeeeee",
    color: theme.colors.black,
    width: "25px",
    height: "25px",
    padding: 0,
    // border: "none",
    // borderLeft: `solid ${theme.colors.white} 1px`,
    border: `solid ${theme.colors.grey[300]} 1px`,
    borderLeft: "none",

    // Focus + hover selector
    "&:focus, &:hover": {
        outline: "none",
        borderColor: theme.colors.grey[300]
    },
    "& > svg": {
        position: "relative",
        top: 2,
        width: "14px",
        height: "14px",
    }
}))

const Description = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
})

const LeftPart = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%"
})

const Title = styled("div")(({ theme }) => ({
    // color: theme.colors.black,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    paddingLeft: "10px",
    color: theme.colors.primary,
    '&:hover': {
        cursor: "pointer",
        color: theme.colors.secondary
    }
}))

const ShortDescription = styled("div")(({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.fontSizes.m,
    fontWeight: theme.fontWeights.normal,
    paddingLeft: "10px",

}))

const DeleteWrapper = styled("button")(({ theme }) => ({
    padding: "0 10px",
    backgroundColor: "transparent",
    color: theme.colors.black,
    // width: "35px",
    // height: "35px",
    // padding: 0,
    border: "none",
    // borderRadius: "99px",
    "&:focus, &:hover": {
        outline: "none",
        border: "none"
    },
    "& > svg": {
        position: "relative",
        width: "20px",
        height: "20px",
        top: 2
    },
    "& > svg:hover": {
        color: theme.colors.secondary,
    }
}))

const Prices = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    whiteSpace: "nowrap"
}))
const PriceHT = styled("div")(({ theme }) => ({
    color: theme.colors.grey[300],
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.bold,
}))
const PriceTTC = styled("div")(({ theme }) => ({
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.bold,
}))

// Changed props: removed defaultOrder, added onUpdateQuantity, onDelete
export const Product = ({ item, onUpdateQuantity, onDelete }) => { 
    const navigate = useNavigate()
    // const dispatch = useDispatch() // Removed

    const handleDelete = () => {
        onDelete(); // Call the onDelete prop passed from ProductList
    }

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) { // Assuming quantity cannot be less than 1
            onUpdateQuantity(newQuantity); // Call the onUpdateQuantity prop
        }
    }

    // Ensure item and item.product exist before trying to access their properties
    if (!item || !item.product) {
        // Optionally render a placeholder or return null if item data is incomplete
        return <ProductWrapper>Produit non disponible ou données manquantes.</ProductWrapper>;
    }
    
    return (
        <ProductWrapper>
            <Img src={item.product.image_link} />
            <Description>
                <LeftPart>
                    <Title onClick={() => navigate(`/products/${item.product.public_id}`)}>{item.product.name}</Title>
                    <ShortDescription>{item.product.supplier?.name || 'Fournisseur inconnu'}</ShortDescription>
                    <Actions>
                        <NumberOfItemsContainer>
                            <Minus onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}><FaMinus /></Minus>
                            <NumberOfItems>{item.quantity}</NumberOfItems>
                            <Plus onClick={() => handleQuantityChange(item.quantity + 1)}><FaPlus /></Plus>
                        </NumberOfItemsContainer>
                        <DeleteWrapper onClick={handleDelete}><RiDeleteBinLine /></DeleteWrapper>
                    </Actions>
                </LeftPart>
                <Prices>
                    {/* Ensure price and tva are numbers before calculation */}
                    <PriceHT>{`${eur((item.product.price || 0) * (item.quantity || 0))} HT`}</PriceHT>
                    <PriceTTC>{eur((item.product.price || 0) * (item.quantity || 0) * (1 + (item.product.tva?.value || 0)))} TTC</PriceTTC>
                </Prices>
            </Description>
        </ProductWrapper>
    )
}