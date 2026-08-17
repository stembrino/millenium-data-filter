/**
 * ResultsSummary - UI Component
 * Displays aggregation summary stats
 */

import type { PresetExecutionResult } from '../engine/presetEngine';

interface ResultsSummaryProps {
  originalRows: number;
  processedRows: number;
  rowsReduced: number;
  reductionPercent: number;
  totalAmount: number;
  results: PresetExecutionResult | null;
}

export function ResultsSummary({
  originalRows,
  processedRows,
  rowsReduced,
  reductionPercent,
  totalAmount,
  results,
}: ResultsSummaryProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#faf5ff',
        borderRadius: '8px',
        border: '1px solid #e9d5ff',
      }}
    >
      {/* Original Rows */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #e9d5ff',
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Linhas Originais
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#9333ea' }}>
          {originalRows}
        </div>
      </div>

      {/* Processed Rows */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #e9d5ff',
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Linhas Processadas
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#059669' }}>
          {processedRows}
        </div>
      </div>

      {/* Rows Reduced */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #e9d5ff',
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Linhas Reduzidas
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#dc2626' }}>
          {rowsReduced} ({reductionPercent}%)
        </div>
      </div>

      {/* Total Amount */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #e9d5ff',
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Valor Total
        </div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#065f46' }}>
          {totalAmount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* Preset Summary */}
      {results && results.summary && (
        <>
          {Object.entries(results.summary).map(([key, value]) => (
            <div
              key={key}
              style={{
                padding: '12px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #e9d5ff',
              }}
            >
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                {key.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#9333ea' }}>
                {typeof value === 'number'
                  ? value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : String(value)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
