import * as React from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Snackbar
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import download1 from '../assets/images/download1.jpg';
import download2 from '../assets/images/download2.jpg';

const StyledCarousel = styled(Carousel)(({ theme }) => ({
  '& .Carousel-indicators-container': {
    bottom: '40px',
    '& button': {
      backgroundColor: 'white',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      margin: '0 6px',
      opacity: 0.6,
      transition: 'all 0.3s ease',
      '&:hover': {
        opacity: 1,
        transform: 'scale(1.2)'
      },
      '&.selected': {
        opacity: 1,
        transform: 'scale(1.3)'
      },
    },
  },
  '& .CarouselButton': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    [theme.breakpoints.down('sm')]: {
      width: '40px',
      height: '40px'
    }
  }
}));

const BannerContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '10%',
  maxWidth: '500px',
  textAlign: 'left',
  padding: theme.spacing(4),
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '16px',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    left: '5%',
    maxWidth: '80%',
    padding: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    textAlign: 'center'
  }
}));

const BannerImage = styled('img')({
  width: '100%',
  height: '600px',
  objectFit: 'cover',
  objectPosition: 'center',
  '@media (max-width: 768px)': {
    height: '500px'
  },
  '@media (max-width: 480px)': {
    height: '400px'
  }
});

function Home() {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const isLoggedIn = localStorage.getItem('MERNEcommerceToken');

  const handleShopNow = () => {
    if (!isLoggedIn) {
      setOpenSnackbar(true);
    } else {
      navigate('/shop');
    }
  };

  const handleLoginRedirect = () => {
    setOpenSnackbar(false);
    navigate('/login');
  };

  const bannerImages = [
    {
      url: download1,
      title: 'Summer Sale - Up to 50% Off',
      description: 'Shop now for the best deals on summer essentials!',
      buttonText: 'Shop Now',
      buttonColor: 'secondary'
    },
    {
      url: download2,
      title: 'New Tech Gadgets',
      description: 'Explore the latest in tech and gadgets.',
      buttonText: 'Discover More',
      buttonColor: 'primary'
    },
  ];

  return (
    <Box sx={{ my: 4 }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', marginBottom: '2rem', position: 'relative' }}>
        <StyledCarousel
          animation="fade"
          duration={1000}
          autoPlay
          interval={5000}
          navButtonsAlwaysVisible
          fullHeightHover={false}
          indicatorContainerProps={{
            style: {
              marginBottom: '20px',
              position: 'absolute',
              zIndex: 1
            }
          }}
        >
          {bannerImages.map((item, i) => (
            <Box key={i} sx={{ position: 'relative' }}>
              <BannerImage
                src={item.url}
                alt={item.title}
              />
              <BannerContent>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 700,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    mb: 3
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    mb: 4,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {item.description}
                </Typography>
              </BannerContent>
            </Box>
          ))}
        </StyledCarousel>
      </Paper>

      {/* Sexy Shop Now Button - Centered */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        borderRadius: '16px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        p: 4,
        mb: 4
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleShopNow}
          sx={{
            px: 8,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
              background: 'linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)',
              '&::after': {
                left: '120%',
                transition: 'all 0.4s ease-in-out'
              }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-60%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)',
              transform: 'rotate(30deg)',
              transition: 'all 0.3s ease-out'
            },
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Snackbar for login prompt */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="You must be logged in to continue!"
        action={
          <Button color="secondary" size="small" onClick={handleLoginRedirect}>
            Log in
          </Button>
        }
      />
    </Box>
  );
}

export default Home;