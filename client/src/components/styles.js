import { styled } from '@mui/material/styles';

// Create a theme-aware style object
const styles = () => ({
  ul: {
    justifyContent: 'space-around',
  },
});

// Custom hook to use the styles
const useStyles = () => {
  return styles;
};

export default useStyles;
