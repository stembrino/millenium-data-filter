/**
 * CFOP Filter Buttons component
 * Radio-style multi-select buttons for CFOP codes
 * Multiple CFOPs can be selected at once with radio-style visual
 */

import { useMemo } from 'react';
import { extractUniqueCfops } from '../engine/cfopEngine';
import type { RowData } from '../types/milenium';

interface CfopFilterButtonsProps {
  data: RowData[];
  selectedCfops: string[];
  onToggleCfop: (cfop: string) => void;
}

export function CfopFilterButtons({
  data,
  selectedCfops,
  onToggleCfop,
}: CfopFilterButtonsProps) {
  // Extract unique CFOPs from data
  const availableCfops = useMemo(
    () => extractUniqueCfops(data),
    [data]
  );

  // Debug: Log what's happening
  useMemo(() => {
    if (data && data.length > 0) {
      console.log('[CfopFilterButtons] Data received:');
      console.log('  Rows:', data.length);
      console.log('  First row keys:', Object.keys(data[0]));
      console.log('  First row:', data[0]);
      console.log('  CFOPs found:', availableCfops);
      console.log('  Cfop values:', data.map((row) => row['Cfop']).slice(0, 5));
      console.log('  Selected CFOPs:', selectedCfops);
    }
  }, [data, availableCfops, selectedCfops]);

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
        Filtrar por CFOP
      </h3>

      {/* CFOP selection buttons - Radio style, Multi-select */}
      {availableCfops.length > 0 ? (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {availableCfops.map((cfop) => {
              const isSelected = selectedCfops.includes(cfop);

              return (
                <button
                  key={cfop}
                  onClick={() => onToggleCfop(cfop)}
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
                  onMouseEnter={(e) => {
                    if (isSelected) return;
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      '#d946ef';
                    (e.currentTarget as HTMLButtonElement).style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      isSelected ? '#9333ea' : '#e9d5ff';
                    (e.currentTarget as HTMLButtonElement).style.color =
                      isSelected ? 'white' : '#581c87';
                  }}
                >
                  {isSelected ? '◉ ' : '○ '}
                  {cfop}
                </button>
              );
            })}
          </div>

          {selectedCfops.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#9333ea',
                fontWeight: '500',
              }}
            >
              ✓ Selecionados: {selectedCfops.join(', ')} ({selectedCfops.length} de{' '}
              {availableCfops.length})
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
          ⚠️ Nenhum CFOP encontrado nos dados. Verifique se o arquivo contém a coluna "Cfop".
        </div>
      )}
    </div>
  );
}
