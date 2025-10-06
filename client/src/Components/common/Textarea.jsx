import React from 'react';

const Textarea = ({
  label = '',
  placeholder = '',
  value,
  onChange,
  error = '',
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  name = '',
  id = '',
  maxLength = null
}) => {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-lg
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          text-gray-900 placeholder-gray-400
          resize-vertical
        `}
      />
      
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <span></span>
        )}
        
        {maxLength && (
          <p className="text-sm text-gray-500">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;