import React from 'react'
import { styled } from "@mui/material"
import { useDispatch } from "react-redux"

import { FaMinus, FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { CircularProgress } from "@mui/material"; // Added for loading state

// import { updateQuantity, deleteProduct } from "@/features/basket/basket.slice"; // Removed
import { 
    useUpdateOrderItemMutation, 
    useRemoveOrderItemMutation 
} from "@/features/order/orderApi"; // RTK Query hooks

import { eur } from "@/utils/format";
// import axios from '@/libs/axios'; // Removed
import toast from 'react-hot-toast';
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

    "&:disabled": {
        backgroundColor: theme.colors.grey[300],
        color: theme.colors.white,
        cursor: "not-allowed"
    },
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

    "&:disabled": {
        backgroundColor: theme.colors.grey[300],
        color: theme.colors.white,
        cursor: "not-allowed"
    },
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

export const Product = ({ isEditable, orderItem, parentOrderId }) => { // Removed setOrder prop
    // const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const [updateItem, { isLoading: isUpdating }] = useUpdateOrderItemMutation();
    const [removeItem, { isLoading: isDeleting }] = useRemoveOrderItemMutation();

    const handleDelete = () => {
        if (!parentOrderId) {
            toast.error("Erreur: ID de commande parent manquant.");
            return;
        }
        removeItem({ orderItemPublicId: orderItem.public_id, orderId: parentOrderId })
            .unwrap()
            .then(() => {
                // UI update will now rely on cache invalidation and parent component re-render
                toast.success("Produit supprimé de la commande.");
            })
            .catch(() => toast.error("Erreur lors de la suppression."));
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1 || !parentOrderId) {
            if(!parentOrderId) toast.error("Erreur: ID de commande parent manquant.");
            return;
        }
        updateItem({ orderItemPublicId: orderItem.public_id, quantity: newQuantity, orderId: parentOrderId })
            .unwrap()
            .then((updatedItemData) => {
                // UI update will now rely on cache invalidation and parent component re-render
                toast.success("Quantité mise à jour.");
            })
            .catch(() => toast.error("Erreur lors de la mise à jour."));
    };

    if (!orderItem || !orderItem.product) {
        return <ProductWrapper>Données de l'article non disponibles.</ProductWrapper>;
    }

    return (
        <ProductWrapper>
            <Img src={orderItem.product.image_link} />
            <Description>
                <LeftPart>
                    <Title onClick={() => navigate(`/products/${orderItem.product.public_id}`)}>{orderItem.product.name}</Title>
                    <ShortDescription>{orderItem.product.supplier?.name || 'Fournisseur inconnu'}</ShortDescription>
                    <Actions>
                        <NumberOfItemsContainer>
                            <Minus 
                                disabled={!isEditable || isUpdating || isDeleting || orderItem.quantity <= 1} 
                                onClick={() => handleQuantityChange(orderItem.quantity - 1)}
                            ><FaMinus /></Minus>
                            <NumberOfItems>{orderItem.quantity}</NumberOfItems>
                            <Plus 
                                disabled={!isEditable || isUpdating || isDeleting} 
                                onClick={() => handleQuantityChange(orderItem.quantity + 1)}
                            ><FaPlus /></Plus>
                        </NumberOfItemsContainer>
                        {isEditable && (
                            <DeleteWrapper onClick={handleDelete} disabled={isDeleting || isUpdating}>
                                {isDeleting ? <CircularProgress size={18} color="inherit"/> : <RiDeleteBinLine />}
                            </DeleteWrapper>
                        )}
                    </Actions>
                </LeftPart>
                <Prices>
                    <PriceHT>{`${eur((orderItem.product.price || 0) * (orderItem.quantity || 0))} HT`}</PriceHT>
                    <PriceTTC>{eur((orderItem.product.price || 0) * (orderItem.quantity || 0) * (1 + (orderItem.product.tva?.value || 0)))} TTC</PriceTTC>
                </Prices>
            </Description>
        </ProductWrapper>
    )
}