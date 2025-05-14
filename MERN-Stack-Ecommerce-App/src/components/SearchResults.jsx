import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
} from '@mui/material';

function SearchResults({ results, onResultClick, setSearchResults }) {
  const handleItemClick = (product) => {
    onResultClick(product);
    setSearchResults([]);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '50vw',
        maxHeight: '50vh',
        overflowY: 'auto',
        padding: '1rem',
      }}
    >
      <List>
        {results.length > 0 ? (
          results.slice(0, 3).map((product) => (
            <ListItem
              key={product._id}
              alignItems="flex-start"
              component={Link}
              to={`/product/${product._id}`}
              onClick={() => handleItemClick(product)}
              sx={{
                borderBottom: '1px solid #eee',
                width: '100%',
                '&:last-child': {
                  borderBottom: 'none',
                },
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Light gray
                  '& .MuiTypography-root': {
                    color: 'black',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={product.name}
                  src={product.image}
                  sx={{ borderRadius: '0' }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{ color: 'red', fontWeight: 'bold' }}
                  >
                    {product.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      ₹{product.price}
                    </Typography>
                    {' - ' + product.description.slice(0, 50) + '...'}
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No results found." />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}

export default SearchResults;
