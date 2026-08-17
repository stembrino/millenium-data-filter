/**
 * Millenium Design System Theme
 * Professional financial ERP software styling
 * Millenium Purple Theme - Enterprise Financial Software
 */

export const milleniumTheme = {
  // Primary Colors - Millenium Purple (enterprise financial software)
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main Millenium purple
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Neutral Colors - Professional Gray Scale
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Status Colors
  success: {
    light: '#dbeafe',
    main: '#10b981',
    dark: '#047857',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#cffafe',
    main: '#0891b2',
    dark: '#0e7490',
  },

  // Financial UI Colors
  positive: '#10b981', // Green for gains
  negative: '#ef4444', // Red for losses
  neutral_value: '#6b7280', // Gray for neutral amounts

  // Backgrounds
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Borders
  border: {
    light: '#e5e7eb',
    main: '#d1d5db',
    dark: '#9ca3af',
  },

  // Text
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Shadows (enterprise style - subtle)
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // Spacing (4px grid)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '2.5rem', // 40px
  },

  // Borders
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    base: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
  },

  // Typography
  typography: {
    // Financial dashboard header
    h1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.5px',
    },
    // Section title
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '1.3',
      letterSpacing: '-0.25px',
    },
    // Subsection title
    h3: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0px',
    },
    // Card/Panel title
    h4: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: '0.25px',
    },
    // Regular body text
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    // Small text (labels, secondary info)
    small: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.4',
      letterSpacing: '0.25px',
    },
    // Form labels
    label: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0.25px',
    },
    // Mono font for numbers/codes
    mono: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '1.4',
      fontFamily: 'ui-monospace, Menlo, Monaco, "Courier New", monospace',
    },
  },

  // Component sizes
  components: {
    // Button sizes
    button: {
      sm: { padding: '0.5rem 1rem', fontSize: '12px' },
      md: { padding: '0.75rem 1.5rem', fontSize: '14px' },
      lg: { padding: '1rem 2rem', fontSize: '16px' },
    },
    // Input sizes
    input: {
      sm: { padding: '0.5rem 0.75rem', fontSize: '12px' },
      md: { padding: '0.75rem 1rem', fontSize: '14px' },
      lg: { padding: '1rem 1.25rem', fontSize: '16px' },
    },
    // Card sizes
    card: {
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      background: '#ffffff',
    },
    // Panel sizes
    panel: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      background: '#f9fafb',
    },
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
} as const;

export type MilleniumTheme = typeof milleniumTheme;
