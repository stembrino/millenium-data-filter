/**
 * Hook for CPF/CNPJ multi-select filter state.
 * Filters by document type: CPF or CNPJ, not by raw values.
 */

import { useCallback, useMemo, useState } from 'react';
import {
  extractUniqueDocumentTypes,
  filterByDocumentTypes,
} from '../engine/documentFilterEngine';
import type { RowData } from '../types/milenium';
import type {
  DocumentSummary,
  DocumentType,
} from '../engine/documentFilterEngine';

export interface DocumentFilterState {
  selectedDocumentTypes: DocumentType[];
  documentSummaries: DocumentSummary[];
}

interface UseDocumentFilterReturn {
  documentFilter: DocumentFilterState;
  toggleDocumentType: (documentType: DocumentType) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export function useDocumentFilter(data: RowData[]): UseDocumentFilterReturn {
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<DocumentType[]>(() => {
    const types = extractUniqueDocumentTypes(data);
    return types.includes('cnpj') ? ['cnpj'] : types;
  });

  const documentSummaries = useMemo(() => {
    if (selectedDocumentTypes.length === 0) {
      return [];
    }

    return filterByDocumentTypes(data, selectedDocumentTypes);
  }, [data, selectedDocumentTypes]);

  const toggleDocumentType = useCallback((documentType: DocumentType) => {
    setSelectedDocumentTypes((prev) => {
      const isSelected = prev.includes(documentType);

      if (isSelected) {
        return prev.filter((item) => item !== documentType);
      }

      return [...prev, documentType];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedDocumentTypes(extractUniqueDocumentTypes(data));
  }, [data]);

  const deselectAll = useCallback(() => {
    setSelectedDocumentTypes([]);
  }, []);

  return {
    documentFilter: {
      selectedDocumentTypes,
      documentSummaries,
    },
    toggleDocumentType,
    selectAll,
    deselectAll,
  };
}
