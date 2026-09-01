/**
 * MilleniumPanel - Enterprise card/panel component
 * Standard container for financial data displays
 * Millenium-inspired professional styling (Purple theme)
 */

import type { ReactNode } from 'react';

interface MilleniumPanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'card' | 'bordered';
  className?: string;
  footer?: ReactNode;
}

export function MilleniumPanel({
  title,
  subtitle,
  children,
  variant = 'default',
  className = '',
  footer,
}: MilleniumPanelProps) {
  const getVariantStyle = () => {
    if (variant === 'bordered') {
      return {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderLeft: '4px solid #9333ea',
        borderRadius: '8px',
      };
    }
    if (variant === 'card') {
      return {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      };
    }
    return {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
    };
  };

  return (
    <div style={{ ...getVariantStyle(), boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} className={className}>
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          {title && (
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h3>
          )}
          {subtitle && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280', margin: 0 }}>{subtitle}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px 24px' }}>{children}</div>

      {/* Footer */}
      {footer && (
        <div style={{ padding: '12px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
