import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword }) => (
  <div className={`w-full ${half ? 'sm:w-1/2' : ''}`}>
    <input
      name={name}
      onChange={handleChange}
      className="w-full border rounded py-2 px-3"
      required
      placeholder={label}
      autoFocus={autoFocus}
      type={type}
    />
  </div>
);

export default Input;
