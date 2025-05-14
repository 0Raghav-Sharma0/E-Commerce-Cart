import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Rating,
  TextField,
  Box,
  Snackbar,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ProductDetails({ updateCartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Product not found' });
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to add to cart' });
      return;
    }
    try {
      await axios.post(
        'http://localhost:8000/api/cart',
        { productId: product._id, quantity },
        { headers: { 'x-auth-token': localStorage.getItem('MERNEcommerceToken') } }
      );
      setSnackbar({ open: true, message: 'Added to cart!' });
      updateCartCount();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add to cart' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: '100%', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{product.name}</Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price.toFixed(2)}
            </Typography>
            <Typography paragraph>{product.description}</Typography>
            
            <Box display="flex" alignItems="center" gap={2} my={2}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography>({product.numReviews} reviews)</Typography>
            </Box>

            <Chip 
              label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
              color={product.stock > 0 ? 'success' : 'error'} 
            />

            {product.stock > 0 && (
              <Box mt={3}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, e.target.value)))}
                  sx={{ width: 100, mr: 2 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={!isAuthenticated && (
          <Button color="secondary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      />
    </Container>
  );
}

export default ProductDetails;