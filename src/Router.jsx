import React, { useEffect, useState } from "react"
import { Routes, Route, useLocation, Navigate, useSearchParams } from "react-router-dom"

import { Catalog, Product, Cart, Command, Confirmation, Profil, ResetPassword, PanelAdmin, Order, DefaultOrder } from "./pages"
import { useSelector } from "react-redux";
import { selectIsAuth } from "./features/auth/auth.selector";


const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

export const Router = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);


    return (
        <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/products/:productId" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/command" element={<ProtectedRoute><Command /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><PanelAdmin /></ProtectedRoute>} />
            <Route path="/orders/:orderId" element={<ProtectedRoute><Order /></ProtectedRoute>} />
            <Route path="/default-orders/:orderId" element={<ProtectedRoute><DefaultOrder /></ProtectedRoute>} />
        </Routes>
    )
}