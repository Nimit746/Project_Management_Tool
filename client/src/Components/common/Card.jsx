import React from 'react';

const Card = ({
  children,
  title = '',
  subtitle = '',
  footer = null,
  hoverable = false,
  className = '',
  onClick = null,
  padding = 'medium'
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  const baseClasses = `
    bg-white rounded-lg shadow-md border border-gray-200
    ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={`${paddingClasses[padding]} border-b border-gray-200`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className={title || subtitle ? paddingClasses[padding] : paddingClasses[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`${paddingClasses[padding]} border-t border-gray-200 bg-gray-50 rounded-b-lg`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;