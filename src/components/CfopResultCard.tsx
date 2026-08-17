/**
 * CFOP Result Card component
 * Generic display for CFOP statistics and aggregations
 * Wraps common styling with MilleniumResultWrapper
 */

import { MilleniumResultWrapper } from './MilleniumResultWrapper';
import { formatCurrency } from '../engine/cfopEngine';
import type { CfopSummary } from '../engine/cfopEngine';

interface CfopResultCardProps {
  summary: CfopSummary;
}

export function CfopResultCard({ summary }: CfopResultCardProps) {
  const averageValue =
    summary.count > 0 ? summary.totalValue / summary.count : 0;

  return (
    <MilleniumResultWrapper
      title={`Resultado CFOP ${summary.cfop}`}
      cfop={summary.cfop}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* Total Value */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9d5ff',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#9333ea',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            Valor Total
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#581c87',
            }}
          >
            {formatCurrency(summary.totalValue)}
          </div>
        </div>

        {/* Invoice Count */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9d5ff',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#9333ea',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            Quantidade de NFes
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#581c87',
            }}
          >
            {summary.count}
          </div>
        </div>

        {/* Average Value */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9d5ff',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#9333ea',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            Valor Médio
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#581c87',
            }}
          >
            {formatCurrency(averageValue)}
          </div>
        </div>

        {/* Data Summary */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9d5ff',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#9333ea',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            Dados
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#7c3aed',
              fontFamily: 'monospace',
            }}
          >
            {summary.rows.length} linhas
          </div>
        </div>
      </div>
    </MilleniumResultWrapper>
  );
}
