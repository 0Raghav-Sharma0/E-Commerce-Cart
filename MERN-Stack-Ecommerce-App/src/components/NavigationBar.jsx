import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  useMediaQuery,
  Box,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import SearchResults from './SearchResults';

function NavigationBar({ cartItemCount }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const searchBarRef = React.useRef(null);
  const searchResultsRef = React.useRef(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  React.useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('MERNEcommerceToken');
      setIsLoggedIn(!!token);
    };
    checkToken();
    const interval = setInterval(checkToken, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('MERNEcommerceToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const debouncedSearch = React.useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/search?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/cart/add',
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('MERNEcommerceToken')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleShopClick = () => {
    if (!isLoggedIn) {
      setOpenSnackbar(true);
    } else {
      navigate('/shop');
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#121212',
        marginBottom: '2rem',
        '& .logo-link': {
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        },
        '& .search-bar': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '25px',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'relative',
        },
        '& .search-bar input': {
          marginLeft: '0.5rem',
          border: 'none',
          outline: 'none',
          color: 'white',
          backgroundColor: 'transparent',
          width: '100%',
        },
        '& .active': {
          color: 'red',
          fontWeight: 'bold',
        },
      }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu id="mobile-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose} component={Link} to="/">
                Home
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <div onClick={handleShopClick}>Shop</div>
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/cart">
                Cart
              </MenuItem>
            </Menu>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" className="logo-link">
                SmartCart
              </Link>
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" className="logo-link">
                SmartCart
              </Link>
            </Typography>
            <form className="search-bar" ref={searchBarRef} onSubmit={(e) => e.preventDefault()}>
              <SearchIcon sx={{ color: 'white' }} />
              <InputBase
                placeholder="Search for a product..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              />
              {loading && <CircularProgress size={20} sx={{ color: 'white', marginLeft: '10px' }} />}
            </form>
            <Button
              color="inherit"
              component={Link}
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
              sx={{ fontSize: '1rem', marginLeft: '1rem', marginRight: '0.5rem' }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={handleShopClick}
              className={location.pathname === '/shop' ? 'active' : ''}
              sx={{ fontSize: '1rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}
            >
              Shop
            </Button>
            {isLoggedIn ? (
              <Button onClick={handleLogout} sx={{ color: '#FF5722', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={{ fontSize: '1rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                Login
              </Button>
            )}
            <Button color="inherit" component={Link} to="/register" sx={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
              Register
            </Button>
            <IconButton color="inherit" component={Link} to="/cart" sx={{ marginLeft: '0.5rem' }}>
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </>
        )}
      </Toolbar>

      <Snackbar
        open={openSnackbar}
        message="You must be logged in to access the shop!"
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        action={
          <Button color="secondary" size="small" onClick={() => navigate('/login')}>
            Log in
          </Button>
        }
      />

      {searchResults.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
          }}
          ref={searchResultsRef}
        >
          <SearchResults
            results={searchResults}
            onResultClick={(product) => navigate(`/product/${product._id}`)}
            setSearchResults={setSearchResults}
          />
        </Box>
      )}
    </AppBar>
  );
}

export default NavigationBar;
