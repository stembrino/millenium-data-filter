/**
 * Série filter buttons.
 * Reads all available series from the dataset and behaves like CFOP chips.
 */

import { useMemo } from 'react';
import { extractUniqueSeries } from '../engine/seriesFilterEngine';
import type { RowData } from '../types/milenium';

interface SeriesFilterButtonsProps {
  data: RowData[];
  selectedSeries: string[];
  onToggleSerie: (serie: string) => void;
}

export function SeriesFilterButtons({
  data,
  selectedSeries,
  onToggleSerie,
}: SeriesFilterButtonsProps) {
  const availableSeries = useMemo(() => extractUniqueSeries(data), [data]);

  return (
    <div
      style={{
        backgroundColor: '#faf5ff',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '16px',
        border: '1px solid #e9d5ff',
      }}
    >
      <h3
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#581c87',
        }}
      >
        Filtrar por Série
      </h3>

      {availableSeries.length > 0 ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableSeries.map((serie) => {
              const isSelected = selectedSeries.includes(serie);

              return (
                <button
                  key={serie}
                  onClick={() => onToggleSerie(serie)}
                  style={{
                    backgroundColor: isSelected ? '#9333ea' : '#e9d5ff',
                    color: isSelected ? 'white' : '#581c87',
                    border: '1px solid ' + (isSelected ? '#7e22ce' : '#e9d5ff'),
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
                  }}
                >
                  {isSelected ? '◉ ' : '○ '}
                  {serie}
                </button>
              );
            })}
          </div>

          {selectedSeries.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#9333ea',
                fontWeight: '500',
              }}
            >
              ✓ Selecionados: {selectedSeries.join(', ')} ({selectedSeries.length} de{' '}
              {availableSeries.length})
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#92400e',
          }}
        >
          ⚠️ Nenhuma série encontrada nos dados.
        </div>
      )}
    </div>
  );
}
