import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = ({ name, handleChange, label, autoFocus, type, handleShowPassword, placeholder }) => (
  <div className="w-full space-y-2 mb-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      onChange={handleChange}
      className="w-full bg-gray-100 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 placeholder:text-sm"
      required
      placeholder={placeholder}
      autoFocus={autoFocus}
      type={type}
    />
  </div>
);

export default Input;
