import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  icon = null
}) => {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    purple: 'bg-purple-100 text-purple-800',
    
    // Priority badges
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    low: 'bg-green-100 text-green-800 border border-green-200',
    
    // Status badges
    todo: 'bg-gray-100 text-gray-800 border border-gray-200',
    inprogress: 'bg-blue-100 text-blue-800 border border-blue-200',
    done: 'bg-green-100 text-green-800 border border-green-200'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;