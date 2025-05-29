import React, { useState } from "react"
import styled from "styled-components"
import { styled as muiStyled } from "@mui/system"
import { useDispatch, useSelector } from "react-redux"
import { IconButton, Popover } from "@mui/material"
import { AiOutlineHeart, AiFillHeart, AiOutlineOrderedList } from 'react-icons/ai'
import { SlBasket, SlBasketLoaded } from 'react-icons/sl'
import { useNavigate } from "react-router-dom";


import { selectIsAuth } from "@/features/auth/auth.selector"
import { 
    useGetDefaultOrdersQuery, 
    useAddItemToDefaultOrderListMutation 
} from "@/features/default-order/defaultOrderApi"; 
import { 
    useAddFavoriteMutation, 
    useRemoveFavoriteMutation 
} from "@/features/favorite/favoriteApi"; // RTK Query hooks for favorites

import { eur } from "@/utils/format"
// import axios from "@/libs/axios"; // Removed as it's no longer used in this file
// import { selectDefaultOrders } from "@/features/default-order/default-order.selector"; 
import toast from "react-hot-toast"
// import { addItemToDefaultOrder } from "@/features/default-order/default-order.slice"; // Removed


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

    const { data: defaultOrdersData } = useGetDefaultOrdersQuery(undefined, { skip: !isAuth });
    const defaultOrders = defaultOrdersData || [];
    const [addItemToOrderCatalog, { isLoading: isAddingToOrderCatalog }] = useAddItemToDefaultOrderListMutation();
    const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
    const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();

    const onProductClick = () => {
        navigate(`/products/${product.public_id}`)
    }

    const onFavoriteClick = (e) => {
        e.stopPropagation();
        if (!isAuth) {
            toast.error("Veuillez vous connecter pour gérer vos favoris.");
            return;
        }
        const currentProductId = product.id; 

        if (product.is_favorite) {
            removeFavorite({ product_id: currentProductId })
                .unwrap()
                .then(() => {
                    toast.success("Produit retiré des favoris");
                    // updateProducts is removed, relying on tag invalidation
                })
                .catch((err) => {
                    toast.error(err?.data?.message || "Erreur lors du retrait des favoris");
                });
        } else {
            addFavorite({ product_id: currentProductId })
                .unwrap()
                .then(() => {
                    toast.success("Produit ajouté aux favoris");
                    // updateProducts is removed, relying on tag invalidation
                })
                .catch((err) => {
                    toast.error(err?.data?.message || "Erreur lors de l'ajout aux favoris");
                });
        }
    }

    const addToDefaultOrder = (order) => {
        addItemToOrderCatalog({
            orderPublicId: order.public_id,
            itemData: { product_id: product.id, quantity: 1 } // Assuming quantity 1 when adding from catalog
        })
            .unwrap()
            .then(() => {
                setAnchorEl(null);
                toast.success("Produit ajouté à la commande par défaut");
            })
            .catch((err) => {
                // Check if the error message indicates the product is already in the order
                if (err?.data?.message?.toLowerCase().includes("product already in default order")) {
                     toast.error("Ce produit est déjà dans cette commande.");
                } else {
                    toast.error(err?.data?.message || "Erreur lors de l'ajout");
                }
            });
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
                        <IconButton 
                            style={{ width: 40, height: 40 }} 
                            onClick={onFavoriteClick} // Updated handler
                            disabled={!isAuth || isAddingFavorite || isRemovingFavorite}
                        >
                            {isAddingFavorite || isRemovingFavorite ? <muiStyled(CircularProgress)(() => ({ color: 'white' })) size={22} /> : (product.is_favorite ? <MuiFillHeart /> : <MuiOutlineHeart />)}
                        </IconButton>
                        <IconButton 
                            style={{ width: 40, height: 40 }} 
                            onClick={e => {
                                e.stopPropagation();
                                if (isAuth) setAnchorEl(e.currentTarget); // Only open popover if authenticated
                                else toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité.");
                            }}
                            // disabled={!isAuth} // Alternative: disable button if not auth
                        >
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
                    open={Boolean(anchorEl) && isAuth} // Ensure popover only opens if authenticated
                    anchorEl={anchorEl}
                    onClose={(e) => {
                        if (e && e.stopPropagation) e.stopPropagation(); // Prevent product click when closing popover
                        setAnchorEl(null);
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <PopoverContent>
                        {defaultOrders.length === 0 && <div style={{ padding: '5px', fontSize: '0.8rem' }}>Aucune commande par défaut.</div>}
                        {defaultOrders.map(order => (
                            <PopoverElement 
                                key={order.public_id} 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent product click
                                    addToDefaultOrder(order);
                                }}
                                disabled={isAddingToOrderCatalog}
                            >
                                {isAddingToOrderCatalog && order.public_id === (anchorEl?.dataset?.orderId) // Basic check, might need refinement
                                    ? `Ajout...` 
                                    : order.name}
                            </PopoverElement>
                        ))}
                    </PopoverContent>
                </Popover>
        </Container>
    )
}