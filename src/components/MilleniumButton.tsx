/**
 * MilleniumButton - Enterprise button component
 * Standard button for financial software UI (Purple theme)
 */

import type { ReactNode } from 'react';

interface MilleniumButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function MilleniumButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: MilleniumButtonProps) {
  const variantStyles = {
    primary: {
      backgroundColor: '#9333ea',
      color: '#ffffff',
      borderColor: '#9333ea',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#111827',
      borderColor: '#d1d5db',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      borderColor: '#dc2626',
    },
    success: {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      borderColor: '#16a34a',
    },
    warning: {
      backgroundColor: '#d97706',
      color: '#ffffff',
      borderColor: '#d97706',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
        border: '1px solid',
        borderRadius: '4px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      className={className}
    >
      {children}
    </button>
  );
}
