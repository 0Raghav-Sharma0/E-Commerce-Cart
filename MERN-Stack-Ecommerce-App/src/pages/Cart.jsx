import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Cart = ({ updateCartCount }) => {
  // State declarations
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Hooks and context
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Indian number formatting function
  const formatIndianPrice = (num) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(num);
  };

  // Helper functions
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (!item.product) return total;
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Data fetching
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('MERNEcommerceToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      const cartData = response.data || { items: [] };
      setCart(cartData);
      
      if (updateCartCount) {
        updateCartCount(cartData.items?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      if (err.response?.status === 401) {
        setSnackbarMessage('Please login to view your cart');
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('MERNEcommerceToken');
      if (!token) {
        setSnackbarMessage('Authentication required');
        setOpenSnackbar(true);
        return;
      }

      // Optimistic UI update
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.product._id !== productId)
      }));
      
      if (updateCartCount) {
        updateCartCount(prevCount => prevCount - 1);
      }

      const response = await axios.delete(
        `http://localhost:8000/api/cart/item/${productId}`,
        { headers: { 'x-auth-token': token } }
      );

      setSnackbarMessage(response.data.message || 'Item removed from cart');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error removing item:', err);
      await fetchCart();
      setSnackbarMessage(
        err.response?.data?.message || 
        'Failed to remove item. Please try again.'
      );
      setOpenSnackbar(true);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('MERNEcommerceToken');
      await axios.delete('http://localhost:8000/api/cart/clear', {
        headers: { 'x-auth-token': token }
      });
      await fetchCart();
      setSnackbarMessage('Cart cleared successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setSnackbarMessage(err.response?.data?.message || 'Failed to clear cart');
      setOpenSnackbar(true);
    }
  };

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setSnackbarMessage('Your cart is empty');
      setOpenSnackbar(true);
      return;
    }

    const validItems = cart.items.filter(item => item.product);
    if (validItems.length === 0) {
      setSnackbarMessage('No valid items in cart');
      setOpenSnackbar(true);
      return;
    }

    localStorage.setItem('checkoutCart', JSON.stringify({
      items: validItems,
      total: calculateTotal()
    }));

    navigate('/checkout', { 
      state: { 
        cartItems: validItems,
        cartTotal: calculateTotal()
      } 
    });
  };

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
      setSnackbarMessage('Please login to view your cart');
      setOpenSnackbar(true);
    }
  }, [isAuthenticated, user]);

  // Loading skeleton
  const renderLoadingSkeletons = () => {
    return [...Array(3)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="rectangular" width={50} height={50} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={120} />
          </Box>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="text" width={60} />
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="text" width={40} />
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="text" width={60} />
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="circular" width={40} height={40} />
        </TableCell>
      </TableRow>
    ));
  };

  // Render logic
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLoginRedirect}
          sx={{ mt: 2 }}
        >
          Login to view your cart
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Your Shopping Cart
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderLoadingSkeletons()}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  if (error || !cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {error ? 'Error loading cart' : 'Your cart is empty'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/shop')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Your Shopping Cart
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item, index) => {
              const itemKey = item.product?._id 
                ? `product-${item.product._id}-${index}` 
                : `item-${index}-${Date.now()}`;
              
              if (!item.product) {
                console.warn('Missing product in cart item:', item);
                return null;
              }

              return (
                <TableRow key={itemKey}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.product.image ? (
                        <Box
                          component="img"
                          src={item.product.image}
                          alt={item.product.name}
                          sx={{ width: 50, height: 50, mr: 2 }}
                        />
                      ) : (
                        <Skeleton variant="rectangular" width={50} height={50} sx={{ mr: 2 }} />
                      )}
                      <Typography>{item.product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    ₹{formatIndianPrice(item.product.price)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    ₹{formatIndianPrice(item.product.price * item.quantity)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleRemoveItem(item.product._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button 
          variant="outlined" 
          color="error"
          onClick={handleClearCart}
          sx={{ mr: 2 }}
        >
          Clear Cart
        </Button>
        <Typography variant="h5" sx={{ mr: 2 }}>
          Total: ₹{formatIndianPrice(calculateTotal())}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        action={
          !isAuthenticated && (
            <Button color="secondary" size="small" onClick={handleLoginRedirect}>
              Login
            </Button>
          )
        }
      />
    </Container>
  );
};

export default Cart;