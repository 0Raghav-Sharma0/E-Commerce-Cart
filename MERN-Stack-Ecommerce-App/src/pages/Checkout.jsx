import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Typography, Button } from '@mui/material';
import CheckoutForm from '../components/CheckoutForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = ({ updateCartCount }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // First try to get cart from location state
    if (location.state?.cartItems) {
      setCart({
        items: location.state.cartItems,
        total: location.state.cartTotal
      });
      setLoading(false);
    } else {
      // Fallback to fetch cart if no state passed
      fetchCart();
    }
  }, [location.state, isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('MERNEcommerceToken');
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { 'x-auth-token': token }
      });
      
      // Filter out any invalid items
      const validItems = response.data?.items?.filter(item => item.product) || [];
      
      setCart({
        items: validItems,
        total: validItems.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0)
      });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!cart?.items?.length) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/cart')}
          sx={{ mt: 2 }}
        >
          Back to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutForm cart={cart} updateCartCount={updateCartCount} />
    </Container>
  );
};

export default Checkout;