import * as React from 'react';
import { 
  Typography, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Safely extract order data from navigation state
  const order = React.useMemo(() => {
    if (!state?.order) return null;
    
    return {
      id: state.order._id || 'N/A',
      items: Array.isArray(state.order.items) ? state.order.items.map(item => ({
        name: item.product?.name || item.name || 'Product not available',
        quantity: item.quantity || 0,
        price: item.price || 0
      })) : [],
      total: state.order.totalPrice || 0,
      date: new Date(state.order.createdAt || Date.now()).toLocaleDateString()
    };
  }, [state]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // Show loading if no order data yet
  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'green', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Order Successful!
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for your purchase.
        </Typography>
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinueShopping}
          sx={{ width: 250 }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
}

export default OrderConfirmation;