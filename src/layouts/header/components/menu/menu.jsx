import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineHeart } from 'react-icons/ai'
import { SlBasket } from 'react-icons/sl'

import { styled } from "@mui/material"

import { toggleModal, disconnect } from '@/features/auth/auth.slice'
import { selectIsAuth } from '@/features/auth/auth.selector'
import { resetUser } from '@/features/auth/user.slice'
import { selectUser } from '@/features/auth/user.selector'

import { Wrapper } from './wrapper'
import { BasketWrapper } from './basket-wrapper'
import { BasketIndicator } from './basket-indicator'
import { ConnectionLink } from './connection-link'
import { useNavigate } from 'react-router-dom'
import { resetSearch } from '@/features/search/search.slice'
import { resetCart } from '@/features/basket/basket.slice'
import { selectAdminOrders } from '@/features/orders/orders.slice'

const LogoWrapper = styled('div')(({ theme }) => ({
    height: "30px",
    "& > svg": {
        color: theme.colors.primary,
        width: "30px",
        height: "30px"
    },
    "&:hover > svg": {
        color: theme.colors.secondary,
        cursor: "pointer"
    }
}))


const Link = styled('div')(({ theme }) => ({
    color: theme.colors.text,
    cursor: "pointer",
    "&:hover": {
        color: theme.colors.secondary
    }
}))




export const Menu = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth)
    const user = useSelector(selectUser)
    const orderToValidate = useSelector(selectAdminOrders).filter(order => order.status === "PENDING").length

    const basketProducts = useSelector((state) => state.basket.products)

    const [isHover, setIsHover] = useState(false)

    const handleMouseEnter = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
    }

    const goToCart = () => {
        navigate("/cart")
    }

    const disconnectUser = () => {
        dispatch(resetCart())
        dispatch(resetUser())
        dispatch(resetSearch())
        dispatch(disconnect())
        navigate("/")
    }

    return (
        <Wrapper>

            {
                isAuth ?
                    (
                        <React.Fragment>
                            <div>Bonjour, {user.firstName}</div>
                            {
                                ["ADMIN", "SUPERADMIN"].includes(user.role) &&
                                    <>
                                        <Link onClick={() => navigate("/admin")}>Panel admin</Link>
                                        {orderToValidate > 0 && (
                                            <span 
                                                style={{
                                                    display: "inline-block",
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    borderRadius: "50%",
                                                    width: "18px",
                                                    height: "18px",
                                                    textAlign: "center",
                                                    lineHeight: "18px",
                                                    fontSize: "12px",
                                                    marginLeft: "-5px"
                                                }}
                                            >
                                                {orderToValidate}
                                            </span>
                                        )}
                                    </>
                            }
                            <Link onClick={() => navigate("/profil")}>Profil</Link>
                            <Link onClick={disconnectUser}>Déconnexion</Link>
                        </React.Fragment>
                    ) : (
                        <ConnectionLink onClick={() => dispatch(toggleModal())}>Se connecter</ConnectionLink>
                    )
            }

            {/* <LogoWrapper>
                <AiOutlineHeart />
            </LogoWrapper> */}
            <BasketWrapper
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={goToCart}
            >
                <LogoWrapper>
                    <SlBasket />
                </LogoWrapper>
                {basketProducts.length > 0 ? <BasketIndicator>{basketProducts.length}</BasketIndicator> : null}
            </BasketWrapper>
            {/* {
                isHover && (
                    <BasketContent>
                        <div>Mon panier</div>
                        <div>Mon panier</div>
                        <div>Mon panier</div>
                        <div>Mon panier</div>
                    </BasketContent>
                )
            } */}
        </Wrapper>
    )
}