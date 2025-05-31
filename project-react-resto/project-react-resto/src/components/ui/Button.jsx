import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component
 * 
 * A reusable button component with different variants and states.
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'btn font-medium rounded focus:outline-none transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white',
    link: 'bg-transparent hover:underline text-blue-600 hover:text-blue-800 p-0',
    outline: 'bg-transparent border border-current hover:bg-gray-100'
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  
  // Full width class
  const fullWidthClass = 'w-full';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? disabledClasses : '',
    fullWidth ? fullWidthClass : '',
    className
  ].join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{typeof children === 'string' ? 'Loading...' : children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'info', 'light', 'dark', 'link', 'outline'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;
