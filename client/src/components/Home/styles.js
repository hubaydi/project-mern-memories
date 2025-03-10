import { styled } from '@mui/material/styles';

// Create a theme-aware style object
const styles = (theme) => ({
  appBarSearch: {
    borderRadius: 4,
    marginBottom: '1rem',
    display: 'flex',
    padding: '16px',
  },
  pagination: {
    borderRadius: 4,
    marginTop: '1rem',
    padding: '16px',
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  searchButton: {
    marginTop: '10px',
  }
});

// Custom hook to use the styles
const useStyles = () => {
  return styles;
};

export default useStyles;
// update this file to make combatible with the latest versions of their respective packages
