// src/App.jsx
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
// Components
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

function App() {
  const [cartItemCount, setCartItemCount] = React.useState(0);

  // Centralized API configuration
  React.useEffect(() => {
    const api = axios.create({
      baseURL: 'http://localhost:8000/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor for auth token
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('MERNEcommerceToken');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    });
  }, []);

  const updateCartCount = async () => {
    const token = localStorage.getItem('MERNEcommerceToken');
    if (!token) {
      setCartItemCount(0);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { 'x-auth-token': token }
      });
      setCartItemCount(response.data?.items?.length || 0);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  React.useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <NavigationBar cartItemCount={cartItemCount} />
          <Container maxWidth="xl" sx={{ py: 4, minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/shop" 
                element={<Shop updateCartCount={updateCartCount} />} 
              />
              <Route 
                path="/product/:id" 
                element={<ProductDetails updateCartCount={updateCartCount} />} 
              />
              <Route 
                path="/cart" 
                element={<Cart updateCartCount={updateCartCount} />} 
              />
              <Route 
                path="/checkout" 
                element={<Checkout updateCartCount={updateCartCount} />} 
              />
              <Route 
                path="/order-success" 
                element={<OrderSuccess />} 
              />
              <Route 
                path="/login" 
                element={<Login updateCartCount={updateCartCount} />} 
              />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;