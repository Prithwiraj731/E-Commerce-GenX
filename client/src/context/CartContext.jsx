import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthConfig = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return { headers: { Authorization: `Bearer ${token}` } };
    }, []);

    const fetchCart = useCallback(async () => {
        const config = getAuthConfig();
        if (!config) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/cart', config);
            setCartItems(res.data.data || []);
        } catch (err) {
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [getAuthConfig]);

    useEffect(() => {
        // Fetch cart only if a token exists
        if (localStorage.getItem('token')) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [fetchCart]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const value = {
        cartItems,
        fetchCart,
        cartCount,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 