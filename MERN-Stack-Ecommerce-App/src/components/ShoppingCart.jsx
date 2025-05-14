import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardMedia, CircularProgress, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Shop({ products, loading, addToCart, removeFromCart, cartItems }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('MERNEcommerceToken'); // Check if user is logged in
  const [openSnackbar, setOpenSnackbar] = React.useState(false); // Snackbar state to show message

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
    setOpenSnackbar(false); // Close the snackbar after redirecting
  };

  const handleAddToCart = product => {
    if (!isLoggedIn) {
      setOpenSnackbar(true); // Show snackbar if not logged in
      return;
    }
    addToCart(product); // Add to cart if logged in
  };

  const handleRemoveFromCart = product => {
    removeFromCart(product); // Remove product from cart
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Shop Now
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {products.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      height="200"
                      image={product.image}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        ₹{product.price}
                      </Typography>

                      {/* Check if the product is in the cart */}
                      {cartItems.some(item => item.id === product.id) ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ mt: 2 }}
                          onClick={() => handleRemoveFromCart(product)}
                        >
                          Remove from Cart
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h6" color="textSecondary" sx={{ my: 2 }}>
            You must be logged in to shop. Please log in to continue.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenSnackbar(true)}>
            Log in
          </Button>
        </div>
      )}

      {/* Snackbar for login prompt */}
      <Snackbar
        open={openSnackbar}
        message="You must be logged in to add items to your cart."
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        action={
          <Button color="secondary" size="small" onClick={handleLoginRedirect}>
            Log in
          </Button>
        }
      />
    </div>
  );
}

export default Shop;
