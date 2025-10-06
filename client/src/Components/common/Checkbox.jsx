import React from 'react';

const Checkbox = ({
  label = '',
  checked = false,
  onChange,
  disabled = false,
  error = '',
  className = '',
  name = '',
  id = ''
}) => {
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-4 h-4 rounded border-gray-300
            text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${error ? 'border-red-500' : ''}
            transition-colors duration-200
          `}
        />
        {label && (
          <label 
            htmlFor={checkboxId}
            className={`
              ml-2 text-sm text-gray-700
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              select-none
            `}
          >
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;