import { styled } from '@mui/material/styles';

// Create a theme-aware style object
const styles = (theme) => ({
  paper: {
    marginTop: '64px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
  root: {
    '& .MuiTextField-root': {
      margin: '8px',
    },
  },
  avatar: {
    margin: '8px',
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '24px',
  },
  submit: {
    margin: '24px 0 16px',
  },
  googleButton: {
    marginBottom: '16px',
  },
});

// Custom hook to use the styles
const useStyles = () => {
  return styles;
};

export default useStyles;