import React from 'react';

// Simple Card components
export function Card({ children, className }) {
  return (
    <div className={`bg-white shadow ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={`border-b border-gray-200 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={className || ''}>
      {children}
    </div>
  );
}

// Simple Button
export function Button({
  children,
  onClick,
  className,
  variant,
  ...rest
}) {
  let baseClasses =
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors';
  let variantClasses = 'bg-gray-200 hover:bg-gray-300';

  if (variant === 'outline') {
    variantClasses =
      'border border-gray-300 hover:bg-gray-100 text-gray-700';
  } else if (variant === 'destructive') {
    variantClasses =
      'bg-red-500 hover:bg-red-600 text-white';
  } else if (variant === 'blue') {
    variantClasses =
      'bg-blue-500 hover:bg-blue-600 text-white';
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Simple Input
export function Input({ className, ...rest }) {
  let baseClasses =
    'border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';
  return (
    <input
      className={`${baseClasses} ${className || ''}`}
      {...rest}
    />
  );
}
