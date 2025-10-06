import React from 'react';

const Avatar = ({
  src = null,
  alt = '',
  name = '',
  size = 'medium',
  className = '',
  status = null // 'online', 'offline', 'busy', 'away'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xlarge: 'w-16 h-16 text-lg'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  const statusSizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3',
    xlarge: 'w-4 h-4'
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate background color based on name
  const getColorFromName = (name) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          font-semibold
          overflow-hidden
          ${!src ? `${getColorFromName(name)} text-white` : 'bg-gray-200'}
        `}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span 
          className={`
            absolute bottom-0 right-0
            ${statusSizeClasses[size]}
            ${statusClasses[status]}
            rounded-full
            border-2 border-white
          `}
        />
      )}
    </div>
  );
};

export default Avatar;