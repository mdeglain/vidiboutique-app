import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from '@/libs/axios';

import { categoriesSuccess } from '@/features/category/category.slice';
import { selectIsAuth } from '@/features/auth/auth.selector';
import { addressesSuccess } from '@/features/address/address.slice';
import { initCart } from "@/features/basket/basket.slice";
import { selectUser } from '@/features/auth/user.selector';
import { setAdminOrders, setOrders } from '@/features/orders/orders.slice';
import { setDefaultOrders } from "@/features/default-order/default-order.slice";

export const GetDefaultData = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuth)
    const user = useSelector(selectUser)

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('categories').then(response => {
                dispatch(categoriesSuccess(response.data.data))
            })
            axios.get('addresses').then(response => {
                dispatch(addressesSuccess(response.data.data))
            })
            axios.get("carts").then(response => {
                dispatch(initCart(response.data.data.cart_items))
            })
            axios.get('/orders').then(response => {
                dispatch(setOrders(response.data.data))
            })
            axios.get("/default-orders").then(response => {
                dispatch(setDefaultOrders(response.data.data));
            })
            if (user.role === "ADMIN") {
                axios.get(`/organizations/${user.organization_id}/orders`).then(response => {
                    dispatch(setAdminOrders(response.data.data))
                })
            }
        }
    }, [isAuthenticated])

    return null;
};