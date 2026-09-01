/**
 * MilleniumBadge - Status/status indicator component
 * For displaying financial status, validation results, etc.
 * Millenium Purple Theme
 */

interface MilleniumBadgeProps {
  label: string;
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: string;
}

export function MilleniumBadge({
  label,
  status,
  size = 'md',
  icon,
}: MilleniumBadgeProps) {
  const getStatusStyle = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: '4px',
      fontWeight: 500,
      border: '1px solid',
      padding: size === 'sm' ? '2px 8px' : '6px 12px',
      fontSize: size === 'sm' ? '12px' : '14px',
    };

    if (status === 'success') {
      return { ...baseStyles, backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    }
    if (status === 'error') {
      return { ...baseStyles, backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
    }
    if (status === 'warning') {
      return { ...baseStyles, backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    }
    if (status === 'info') {
      return { ...baseStyles, backgroundColor: '#faf5ff', color: '#6b21a8', borderColor: '#e9d5ff' };
    }
    return { ...baseStyles, backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' };
  };

  return (
    <span style={getStatusStyle()}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
