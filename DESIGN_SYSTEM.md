# Millenium Design System

Professional financial ERP software design system and component library for the Millenium Data Filter & Converter application.

---

## 🎨 Design Philosophy

The Millenium Design System is built to match enterprise financial software standards:

- **Professional purple Color Scheme** - Primary brand color (#5a7dff) used in banking and financial software
- **Enterprise Gray Scale** - Clean neutral palette for data-heavy interfaces
- **Clear Typography** - Readable font sizes and weights optimized for financial data
- **Financial Status Colors** - Green for gains, Red for losses, purple for neutral
- **Subtle Shadows** - Professional depth without visual clutter
- **Consistent Spacing** - 4px grid-based spacing (4px, 8px, 12px, 16px, 24px, 32px, 40px)

---

## 🎯 Color Palette

### Primary Colors (Enterprise purple)
```
primary-50:   #f0f5ff  (Ultra light background)
primary-100:  #e0ebff
primary-200:  #c1d7ff
primary-300:  #a3c4ff
primary-400:  #8ab0ff
primary-500:  #5a7dff  ← Main brand color
primary-600:  #4563e8
primary-700:  #3449d1
primary-800:  #2836b0
primary-900:  #1d268f  (Dark text/accents)
```

### Status Colors
- **Success (Green):** #10b981 - Valid data, confirmed transactions
- **Error (Red):** #ef4444 - Validation errors, failed operations
- **Warning (Amber):** #f59e0b - Warnings, data quality issues
- **Info (Cyan):** #0891b2 - Information, general status

### Financial Colors
- **Positive (Green):** #10b981 - Gains, credits
- **Negative (Red):** #ef4444 - Losses, debits
- **Neutral (Gray):** #6b7280 - Neutral amounts

---

## 📐 Typography

| Level | Size | Weight | Line Height | Use Case |
|:---|:---|:---|:---|:---|
| **H1** | 28px | 700 | 1.2 | Page title (rare in financial UIs) |
| **H2** | 24px | 600 | 1.3 | Main section header |
| **H3** | 18px | 600 | 1.4 | Subsection/panel title |
| **H4** | 14px | 600 | 1.5 | Card title, grid header |
| **Body** | 14px | 400 | 1.5 | Regular text, labels |
| **Small** | 12px | 400 | 1.4 | Secondary info, hints |
| **Label** | 12px | 600 | 1.4 | Form labels, column headers |
| **Mono** | 12px | 500 | 1.4 | Numbers, codes, amounts |

---

## 🧩 Components

### 1. MilleniumPanel
Container component for displaying financial data, forms, or sections.

**Variants:**
- `default` - White background with border
- `card` - Light gray background
- `bordered` - Left border accent (purple)

**Props:**
```typescript
interface MilleniumPanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'card' | 'bordered';
  className?: string;
  footer?: ReactNode;
}
```

**Usage:**
```tsx
<MilleniumPanel
  title="Financial Summary"
  subtitle="Q3 2026 Results"
  variant="default"
>
  {/* Content */}
</MilleniumPanel>
```

---

### 2. MilleniumButton
Professional button component for actions and submissions.

**Variants:**
- `primary` - Main action button (purple)
- `secondary` - Alternative action (gray)
- `success` - Positive action (green)
- `warning` - Caution action (amber)
- `danger` - Destructive action (red)

**Sizes:**
- `sm` - Small (12px text, 8px padding)
- `md` - Medium (14px text, 12px padding) ← Default
- `lg` - Large (16px text, 16px padding)

**Props:**
```typescript
interface MilleniumButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage:**
```tsx
<MilleniumButton variant="primary" size="md" onClick={handleSave}>
  Save Changes
</MilleniumButton>
```

---

### 3. MilleniumBadge
Status indicator for displaying validation results, states, etc.

**Status Types:**
- `success` - Green (valid data, confirmed)
- `error` - Red (validation failed)
- `warning` - Amber (caution)
- `info` - purple (information)
- `neutral` - Gray (neutral state)

**Sizes:**
- `sm` - Compact (12px text)
- `md` - Regular (14px text) ← Default

**Props:**
```typescript
interface MilleniumBadgeProps {
  label: string;
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: string;
}
```

**Usage:**
```tsx
<MilleniumBadge label="Valid" status="success" icon="✓" />
<MilleniumBadge label="Processing" status="info" icon="⟳" />
```

---

### 4. MilleniumTable
Data table component for displaying financial records, ledgers, transactions.

**Features:**
- Alternating row colors (striped mode)
- Compact or spacious padding
- Column alignment control (left, center, right)
- Custom column widths
- Empty state handling

**Props:**
```typescript
interface Column {
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface Row {
  id: string;
  values: (string | number | ReactNode)[];
}

interface MilleniumTableProps {
  columns: Column[];
  rows: Row[];
  striped?: boolean;
  compact?: boolean;
}
```

**Usage:**
```tsx
<MilleniumTable
  columns={[
    { header: 'ID', align: 'left' },
    { header: 'Amount', align: 'right' },
    { header: 'Status', align: 'center' },
  ]}
  rows={[
    { id: '1', values: ['TXN001', 'R$ 1,250.50', 'Confirmed'] },
    { id: '2', values: ['TXN002', 'R$ 875.25', 'Pending'] },
  ]}
  striped
/>
```

---

## 🌳 Design Tokens

### Spacing (4px grid)
```typescript
xs:   '0.25rem',  // 4px
sm:   '0.5rem',   // 8px
md:   '1rem',     // 16px
lg:   '1.5rem',   // 24px
xl:   '2rem',     // 32px
2xl:  '2.5rem',   // 40px
```

### Border Radius
```typescript
none: '0',
sm:   '0.25rem',   // 4px
base: '0.375rem',  // 6px
md:   '0.5rem',    // 8px
lg:   '0.75rem',   // 12px
xl:   '1rem',      // 16px
```

### Shadows
```typescript
xs:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
sm:   '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
md:   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
lg:   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
```

### Transitions
```typescript
fast:  '150ms ease-in-out'  // Quick feedback
base:  '200ms ease-in-out'  // Standard animation
slow:  '300ms ease-in-out'  // Emphasized animation
```

---

## 📋 Component Sizes

### Button
- **Small:** 8px vertical, 12px horizontal, 12px font
- **Medium:** 12px vertical, 16px horizontal, 14px font ← Default
- **Large:** 16px vertical, 32px horizontal, 16px font

### Input Fields
- **Small:** 8px vertical, 12px horizontal, 12px font
- **Medium:** 12px vertical, 16px horizontal, 14px font ← Default
- **Large:** 16px vertical, 20px horizontal, 16px font

### Card
- Padding: 16px
- Border Radius: 8px
- Border: 1px solid #d1d5db
- Background: white

### Panel
- Padding: 24px
- Border Radius: 12px
- Border: 1px solid #e5e7eb
- Background: #f9fafb

---

## 🎨 Usage Example

```tsx
import {
  MilleniumPanel,
  MilleniumButton,
  MilleniumBadge,
  MilleniumTable,
} from './components';

export function FinancialDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <MilleniumPanel
        title="Financial Overview"
        variant="default"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <MilleniumBadge label="Active" status="success" icon="✓" />
          </div>
          <MilleniumButton variant="primary">
            Generate Report
          </MilleniumButton>
        </div>
      </MilleniumPanel>

      {/* Data Table */}
      <MilleniumPanel title="Transactions" variant="card">
        <MilleniumTable
          columns={[
            { header: 'Transaction ID', width: '20%' },
            { header: 'Amount', align: 'right', width: '15%' },
            { header: 'Date', width: '15%' },
            { header: 'Status', align: 'center', width: '15%' },
          ]}
          rows={data}
          striped
        />
      </MilleniumPanel>
    </div>
  );
}
```

---

## 🔄 Integration with Tailwind

The Millenium Design System uses Tailwind CSS utilities. The theme is configured in `tailwind.config.js` with:

- Primary purple color palette
- Professional gray scale
- Status colors (green, red, amber, purple)
- Financial accent colors

Custom Tailwind classes can extend the design system:

```html
<!-- Using Tailwind utilities with Millenium design -->
<div class="bg-primary-50 border border-primary-200 rounded-md p-4">
  <h3 class="text-primary-900 font-semibold text-base">Financial Data</h3>
  <p class="text-gray-600 text-sm mt-2">Professional enterprise styling</p>
</div>
```

---

## 📚 When to Use Each Component

| Component | Use Case |
|:---|:---|
| **MilleniumPanel** | Container for sections, forms, data displays |
| **MilleniumButton** | Form submissions, actions, navigation |
| **MilleniumBadge** | Status indicators, validation results, tags |
| **MilleniumTable** | Financial records, ledgers, transaction lists |

---

## 🎯 Best Practices

1. **Color Meaning** - Use colors consistently:
   - Green for success/gains
   - Red for errors/losses
   - purple for information
   - Gray for neutral

2. **Spacing** - Follow the 4px grid for consistency

3. **Typography** - Use appropriate weights and sizes for hierarchy

4. **Component Variants** - Choose the right variant for the context

5. **Accessibility** - Ensure sufficient color contrast and clear labels

---

**Millenium Design System © 2026**  
Professional financial ERP software styling standards
