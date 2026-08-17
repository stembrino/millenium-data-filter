/**
 * Custom React hook for managing CFOP filter state and operations
 * Handles accumulating CFOP selections and data filtering
 */

import { useState, useCallback, useMemo } from 'react';
import { filterByCfops, getCfopStats } from '../engine/cfopEngine';
import type { RowData } from '../types/milenium';
import type { CfopSummary } from '../engine/cfopEngine';

export interface CfopFilterState {
  selectedCfops: string[];
  cfopSummaries: CfopSummary[];
}

interface UseCfopFilterReturn {
  cfopFilter: CfopFilterState;
  toggleCfop: (cfop: string) => void;
  selectSingleCfop: (cfop: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  executeFilter: () => void;
}

/**
 * Hook to manage CFOP filter selections and execution
 * Defaults to "5.101" pre-selected
 *
 * @param data Parsed Millenium export rows
 * @returns CFOP filter state and manipulation functions
 */
export function useCfopFilter(data: RowData[]): UseCfopFilterReturn {
  // Start with empty, will only select if "5.101" exists in data
  const [selectedCfops, setSelectedCfops] = useState<string[]>(() => {
    // Check if "5.101" exists in the data
    const hasSFOP = data.some(
      (row) => row['Cfop'] && (row['Cfop'] as string).trim() === '5.101'
    );
    return hasSFOP ? ['5.101'] : [];
  });

  // Compute CFOP summaries whenever data or selection changes
  const cfopSummaries = useMemo(() => {
    if (selectedCfops.length === 0) {
      return [];
    }
    return filterByCfops(data, selectedCfops);
  }, [data, selectedCfops]);

  /**
   * Toggle a CFOP on/off in the selection
   * If already selected, remove it; otherwise add it
   */
  const toggleCfop = useCallback((cfop: string) => {
    setSelectedCfops((prev) => {
      const isSelected = prev.includes(cfop);
      if (isSelected) {
        return prev.filter((c) => c !== cfop);
      } else {
        return [...prev, cfop];
      }
    });
  }, []);

  /**
   * Select a single CFOP (replaces all others)
   */
  const selectSingleCfop = useCallback((cfop: string) => {
    setSelectedCfops([cfop]);
  }, []);

  /**
   * Select all available CFOPs
   * Extracts all unique CFOPs from data
   */
  const selectAll = useCallback(() => {
    const allCfops = Array.from(
      new Set(
        data
          .map((row) => row['Cfop'])
          .filter((cfop) => cfop && typeof cfop === 'string')
          .map((cfop) => (cfop as string).trim())
      )
    ).sort();

    setSelectedCfops(allCfops);
  }, [data]);

  /**
   * Deselect all CFOPs (clear selection)
   */
  const deselectAll = useCallback(() => {
    setSelectedCfops([]);
  }, []);

  /**
   * Execute filter (placeholder for future export/processing)
   */
  const executeFilter = useCallback(() => {
    console.log('CFOP Filter executed:', {
      selectedCfops,
      summaries: cfopSummaries,
      stats: cfopSummaries.map((s) => getCfopStats(s)),
    });
  }, [selectedCfops, cfopSummaries]);

  return {
    cfopFilter: {
      selectedCfops,
      cfopSummaries,
    },
    toggleCfop,
    selectSingleCfop,
    selectAll,
    deselectAll,
    executeFilter,
  };
}
