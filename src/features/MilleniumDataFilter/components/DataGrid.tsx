/**
 * DataGrid - UI Component
 * Simple table for displaying processed data
 */

import type { RowData } from '../types/milenium';

interface DataGridProps {
  data: RowData[];
  maxRows?: number;
}

export function DataGrid({ data, maxRows = 10 }: DataGridProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#666',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <p style={{ margin: 0 }}>Nenhum dado para exibir</p>
      </div>
    );
  }

  // Get column names from first row
  const columns = Object.keys(data[0]);
  const displayRows = data.slice(0, maxRows);
  const isLimited = data.length > maxRows;

  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fff',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#9333ea',
              color: '#fff',
            }}
          >
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                borderRight: '1px solid #e5e7eb',
              }}
            >
              #
            </th>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderRight: '1px solid #e5e7eb',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <td
                style={{
                  padding: '10px 12px',
                  fontWeight: '600',
                  color: '#666',
                  borderRight: '1px solid #e5e7eb',
                }}
              >
                {idx + 1}
              </td>
              {columns.map((col) => (
                <td
                  key={`${idx}-${col}`}
                  style={{
                    padding: '10px 12px',
                    borderRight: '1px solid #e5e7eb',
                    color: '#333',
                  }}
                >
                  {formatCellValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isLimited && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f0fdf4',
            color: '#065f46',
            fontSize: '12px',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          Exibindo {displayRows.length} de {data.length} linhas
        </div>
      )}
    </div>
  );
}

/**
 * Format cell value for display
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'number') {
    // Try to format as currency if it looks like an amount
    if (value > 100 || value < -100) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'string') {
    return value.length > 50 ? value.substring(0, 50) + '...' : value;
  }

  return String(value);
}
