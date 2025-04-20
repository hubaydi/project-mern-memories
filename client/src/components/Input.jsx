import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Input = ({ name, handleChange, label, autoFocus, type, handleShowPassword, placeholder, error }) => (
  <div className="w-full space-y-2 mb-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        name={name}
        onChange={handleChange}
        className={`w-full bg-gray-100 rounded py-2 px-3 focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} placeholder:text-gray-400 placeholder:text-sm`}
        required
        placeholder={placeholder}
        autoFocus={autoFocus}
        type={type}
        id={name}
      />
      {name === 'password' && handleShowPassword && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          onClick={handleShowPassword}
        >
          {type === 'password' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs italic">{error}</p>}
  </div>
);

export default Input;
