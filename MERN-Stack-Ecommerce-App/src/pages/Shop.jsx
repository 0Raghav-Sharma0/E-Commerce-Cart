import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Shop() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [animatedCards, setAnimatedCards] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/products');
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setSnackbarMessage('Failed to load products');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const capitalizeCategory = (category) => 
    category.charAt(0).toUpperCase() + category.slice(1);

  const uniqueCategories = ['all', ...new Set(products.map(product => 
    capitalizeCategory(product.category)))];

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => 
        capitalizeCategory(product.category) === categoryFilter
      );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please login to add items to cart');
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(
        'http://localhost:8000/api/cart',
        { productId: product._id, quantity: 1 },
        { headers: { 'x-auth-token': localStorage.getItem('MERNEcommerceToken') } }
      );
      setSnackbarMessage(`${product.name} added to cart!`);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to add to cart');
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Shop</Typography>
      
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          label="Category"
        >
          {uniqueCategories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {paginatedProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCard 
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        action={!isAuthenticated && (
          <Button color="secondary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      />
    </Container>
  );
}

export default Shop;