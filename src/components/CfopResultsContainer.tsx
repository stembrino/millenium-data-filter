/**
 * CFOP Results Container component
 * Displays result cards for all selected CFOPs
 */

import { CfopResultCard } from './CfopResultCard';
import type { CfopSummary } from '../engine/cfopEngine';

interface CfopResultsContainerProps {
  summaries: CfopSummary[];
  hasSelection: boolean;
}

export function CfopResultsContainer({
  summaries,
  hasSelection,
}: CfopResultsContainerProps) {
  if (!hasSelection) {
    return (
      <div
        style={{
          backgroundColor: '#faf5ff',
          border: '1px dashed #e9d5ff',
          padding: '24px',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#9333ea',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Nenhum CFOP selecionado. Selecione pelo menos um para visualizar os resultados.
        </div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#faf5ff',
          border: '1px dashed #e9d5ff',
          padding: '24px',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#9333ea',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Nenhum dado encontrado para os CFOPs selecionados.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #e9d5ff',
        }}
      >
        <h3
          style={{
            margin: '0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#581c87',
          }}
        >
          Resultados de Filtragem
        </h3>
      </div>

      <div>
        {summaries.map((summary) => (
          <CfopResultCard key={summary.cfop} summary={summary} />
        ))}
      </div>
    </div>
  );
}
