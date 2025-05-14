import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, price, updateCartCount }) {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const { isAuthenticated } = useAuth();

  const handleLoginRedirect = () => {
    setOpenSnackbar(false);
    navigate('/login');
  };

  const handleViewDetails = (event) => {
    event?.stopPropagation();
    if (!isAuthenticated) {
      setSnackbarMessage('You must be logged in to view product details!');
      setOpenSnackbar(true);
      return;
    }
    navigate(`/product/${product._id}`);
  };

  const handleCardClick = (event) => {
    // Only navigate if the click wasn't on a button
    if (!event.target.closest('button')) {
      handleViewDetails();
    }
  };

  const handleAddToCart = async (event) => {
  event.stopPropagation();
  
  if (!isAuthenticated) {
    setSnackbarMessage('Please login to add items to your cart');
    setOpenSnackbar(true);
    return;
  }

  try {
    const token = localStorage.getItem('MERNEcommerceToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      'http://localhost:8000/api/cart',
      { 
        productId: product._id, 
        quantity: 1,
        price: product.price // Add price if backend expects it
      },
      {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Add this if using cookies
      }
    );

    setSnackbarMessage('Item added to cart successfully!');
    setOpenSnackbar(true);
    if (updateCartCount) updateCartCount();
  } catch (error) {
    console.error('Error adding to cart:', error);
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       'Failed to add item to cart';
    setSnackbarMessage(errorMessage);
    setOpenSnackbar(true);
  }
};
  return (
    <>
      <Card 
        sx={{ 
          maxWidth: 345, 
          height: '100%', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column'
        }} 
        onClick={handleCardClick}
      >
        <div style={{ position: 'relative', paddingBottom: '100%' }}>
          <CardMedia
            component="img"
            alt={product.name}
            src={product.image}
            loading="eager"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
            {price}
          </Typography>
        </CardContent>

        <CardActions disableSpacing sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleAddToCart}
            sx={{ flex: 1, mr: 1 }}
          >
            Add to Cart
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(e);
            }}
            sx={{ flex: 1 }}
          >
            Details
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={openSnackbar}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          !isAuthenticated && (
            <Button color="secondary" size="small" onClick={handleLoginRedirect}>
              Log in
            </Button>
          )
        }
      />
    </>
  );
}
