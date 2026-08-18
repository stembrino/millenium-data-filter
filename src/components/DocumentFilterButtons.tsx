/**
 * CPF/CNPJ type selector.
 * Works as a radio-style multi-select filter by document category.
 */

import { useMemo } from 'react';
import {
  extractUniqueDocumentTypes,
  type DocumentType,
} from '../engine/documentFilterEngine';
import type { RowData } from '../types/milenium';

interface DocumentFilterButtonsProps {
  data: RowData[];
  selectedDocumentTypes: DocumentType[];
  onToggleDocumentType: (documentType: DocumentType) => void;
}

export function DocumentFilterButtons({
  data,
  selectedDocumentTypes,
  onToggleDocumentType,
}: DocumentFilterButtonsProps) {
  const availableDocumentTypes = useMemo(
    () => extractUniqueDocumentTypes(data),
    [data]
  );

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
        Filtrar por CPF/CNPJ
      </h3>

      {availableDocumentTypes.length > 0 ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableDocumentTypes.map((documentType) => {
              const isSelected = selectedDocumentTypes.includes(documentType);

              return (
                <button
                  key={documentType}
                  onClick={() => onToggleDocumentType(documentType)}
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
                  {documentType.toUpperCase()}
                </button>
              );
            })}
          </div>

          {selectedDocumentTypes.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#9333ea',
                fontWeight: '500',
              }}
            >
              ✓ Selecionados: {selectedDocumentTypes.map((type) => type.toUpperCase()).join(', ')} ({selectedDocumentTypes.length} de{' '}
              {availableDocumentTypes.length})
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
          ⚠️ Nenhum CPF/CNPJ válido encontrado nos dados.
        </div>
      )}
    </div>
  );
}
