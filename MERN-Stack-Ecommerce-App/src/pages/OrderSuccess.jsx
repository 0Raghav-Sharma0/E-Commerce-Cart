import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Check if order data exists
  const hasOrder = React.useMemo(() => {
    return Boolean(state?.order);
  }, [state]);

  // Redirect to home if no order data exists
  React.useEffect(() => {
    if (!hasOrder) {
      navigate('/');
    }
  }, [hasOrder, navigate]);

  // Loading state while checking order data
  if (!hasOrder) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ 
          fontSize: 80, 
          color: 'success.main', 
          mb: 2 
        }} />
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for your purchase.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/shop')}
          sx={{ width: 250 }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSuccess;