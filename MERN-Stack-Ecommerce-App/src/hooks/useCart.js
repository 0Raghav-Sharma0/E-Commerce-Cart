// hooks/useCart.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem('MERNEcommerceToken');
    if (!token) {
      setCart([]);
      setCartItemCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/cart', {
        headers: { 'x-auth-token': token }
      });
      setCart(response.data?.items || []);
      setCartItemCount(response.data?.items?.length || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { cart, cartItemCount, loading, fetchCart };
};