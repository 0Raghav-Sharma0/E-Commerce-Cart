import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212', // Dark shade like nav bar
        color: 'white',
        padding: '2rem 0',
        marginTop: '2rem',
        boxShadow: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              About Us
            </Typography>
            <Typography variant="body2">
            At SmartCart, we are passionate about bringing you the latest and most innovative tech products from across the globe. Whether you're a gadget enthusiast, a professional, or simply looking to upgrade your tech collection, we have something for everyone
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Quick Links
            </Typography>
            <Box>
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/cart', label: 'Cart' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
              ].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="inherit"
                  underline="none"
                  sx={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#f50057' },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Project Maintainer:{' '}
              <Link
                href="https://github.com/0Raghav-Sharma0"
                color="inherit"
                sx={{
                  textDecoration: 'underline',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#f50057' },
                }}
              >
                Raghav Sharma
              </Link>
            </Typography>
            <Typography variant="body2">
              Email:{' '}
              <Link
                href="mailto:hoangson091104@gmail.com"
                color="inherit"
                sx={{
                  textDecoration: 'underline',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#f50057' },
                }}
              >
                raghav.sharma09900@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2">Phone: +91 (79) 73310617</Typography>
            <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
              Address: C1004 Supermax Society Sector 33 Sonepat, Haryan, India
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Line */}
        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '2rem',
            paddingTop: '1rem',
          }}
        >
          <Typography variant="body2">© {new Date().getFullYear()} Raghav's Smart Cart. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
