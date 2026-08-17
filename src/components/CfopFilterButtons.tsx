/**
 * CFOP Filter Buttons component
 * Dropdown-style multi-select buttons for CFOP codes
 * Supports accumulating selections (checkbox behavior)
 */

import { useMemo } from 'react';
import { extractUniqueCfops } from '../engine/cfopEngine';
import type { RowData } from '../types/milenium';

interface CfopFilterButtonsProps {
  data: RowData[];
  selectedCfops: string[];
  onToggleCfop: (cfop: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function CfopFilterButtons({
  data,
  selectedCfops,
  onToggleCfop,
  onSelectAll,
  onDeselectAll,
}: CfopFilterButtonsProps) {
  // Extract unique CFOPs from data
  const availableCfops = useMemo(
    () => extractUniqueCfops(data),
    [data]
  );

  const allSelected = availableCfops.length === selectedCfops.length;

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
      <div
        style={{
          marginBottom: '12px',
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

        {/* "Todos" / "All" button */}
        <button
          onClick={() => (allSelected ? onDeselectAll() : onSelectAll())}
          style={{
            backgroundColor: allSelected ? '#9333ea' : '#e9d5ff',
            color: allSelected ? 'white' : '#581c87',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            marginRight: '8px',
            marginBottom: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (allSelected) return;
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              '#d946ef';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            if (allSelected) return;
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              '#e9d5ff';
            (e.currentTarget as HTMLButtonElement).style.color = '#581c87';
          }}
        >
          {allSelected ? '✓ Todos' : 'Todos'}
        </button>
      </div>

      {/* CFOP selection buttons */}
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
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
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
              {isSelected ? '✓ ' : '○ '}
              {cfop}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#9333ea',
        }}
      >
        {selectedCfops.length} de {availableCfops.length} selecionado(s)
      </div>
    </div>
  );
}
