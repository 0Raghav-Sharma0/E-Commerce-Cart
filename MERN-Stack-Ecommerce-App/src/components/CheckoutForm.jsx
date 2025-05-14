import React, { useState } from 'react';
import {
  TextField, Button, Typography, Grid, CircularProgress,
  Box, Paper, Divider, Alert
} from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ cart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    country: 'India',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  const [cardFocused, setCardFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  // Indian number formatting function
  const formatIndianPrice = (num) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(num);
  };

  // Calculate total from cart items
  const calculatedTotal = cart?.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  ) || 0;

  // Luhn algorithm for card validation
  const isValidCardNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Validate expiry date
  const isValidExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    switch (name) {
      case 'cardNumber':
        sanitizedValue = value.replace(/\D/g, '').slice(0, 16);
        if (sanitizedValue.length > 4) {
          sanitizedValue = sanitizedValue.match(/.{1,4}/g).join(' ');
        }
        break;
      case 'expiry':
        sanitizedValue = value.replace(/[^0-9]/g, '');
        if (sanitizedValue.length > 2) {
          sanitizedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2, 4)}`;
        }
        sanitizedValue = sanitizedValue.slice(0, 5);
        break;
      case 'cvc':
        sanitizedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
      case 'postalCode':
        sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
        break;
      default:
        sanitizedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Mark field as touched when changing
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleInputFocus = (e) => {
    setCardFocused(e.target.name);
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name should be at least 3 characters';
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }

    // Address validation
    if (!formData.shippingAddress.trim()) {
      errors.shippingAddress = 'Address is required';
    } else if (formData.shippingAddress.trim().length < 10) {
      errors.shippingAddress = 'Address should be more specific';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    // Postal code validation (India specific)
    if (!formData.postalCode || formData.postalCode.length !== 6) {
      errors.postalCode = '6-digit postal code required';
    }

    // Card number validation
    const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16) {
      errors.cardNumber = '16-digit card number required';
    } else if (!isValidCardNumber(cleanedCardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      errors.cardName = 'Name on card is required';
    }

    // Expiry validation
    if (!isValidExpiry(formData.expiry)) {
      errors.expiry = 'Valid MM/YY expiry required';
    }

    // CVC validation
    if (formData.cvc.length < 3 || formData.cvc.length > 4) {
      errors.cvc = '3 or 4 digit CVC required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mark all fields as touched to show errors
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        shippingAddress: {
          address: formData.shippingAddress,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'Credit Card',
        items: cart.items.map(item => ({
          product: item.product?._id,
          quantity: item.quantity,
          price: item.product?.price,
        })),
        itemsPrice: calculatedTotal,
        taxPrice: calculatedTotal * 0.1, // 10% tax
        shippingPrice: calculatedTotal > 1000 ? 0 : 50, // Free shipping over 1000
        totalPrice: calculatedTotal * 1.1 + (calculatedTotal > 1000 ? 0 : 50),
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(`http://localhost:8000/api/orders`, orderData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      navigate('/order-success', { state: { order: response.data } });
    } catch (err) {
      console.error('Order submission error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Order submission failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const errors = validateForm();
  const isFieldError = (field) => touched[field] && errors[field];
  const isFormValid = Object.keys(errors).length === 0;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Shipping Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('name')}
              helperText={isFieldError('name') && errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('email')}
              helperText={isFieldError('email') && errors.email}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('shippingAddress')}
              helperText={isFieldError('shippingAddress') && errors.shippingAddress}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('city')}
              helperText={isFieldError('city') && errors.city}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('postalCode')}
              helperText={isFieldError('postalCode') && errors.postalCode}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              disabled
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Payment Details
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Cards
            number={formData.cardNumber}
            name={formData.cardName}
            expiry={formData.expiry}
            cvc={formData.cvc}
            focused={cardFocused}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('cardNumber')}
              helperText={isFieldError('cardNumber') && errors.cardNumber}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name on Card"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('cardName')}
              helperText={isFieldError('cardName') && errors.cardName}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date (MM/YY)"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('expiry')}
              helperText={isFieldError('expiry') && errors.expiry}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVC"
              name="cvc"
              placeholder="123"
              value={formData.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={!!isFieldError('cvc')}
              helperText={isFieldError('cvc') && errors.cvc}
              required
            />
          </Grid>
         </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Total: ₹{formatIndianPrice(calculatedTotal)}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !isFormValid}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Place Order'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CheckoutForm;