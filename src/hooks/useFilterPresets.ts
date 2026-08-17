/**
 * useFilterPresets - React hook for preset management
 * Handles preset selection, execution, and result state
 */

import { useState, useCallback } from 'react';
import { FILTER_PRESETS, getPresetById } from '../engine/filterPresets';
import {
  executePreset,
  type PresetExecutionResult,
} from '../engine/presetEngine';
import type { RowData } from '../types/milenium';

interface FilterPresetsState {
  isExecuting: boolean;
  activePreset: string | null;
  results: PresetExecutionResult | null;
  error: string | null;
  processedData: RowData[];
}

export function useFilterPresets(initialData: RowData[] | null) {
  const [state, setState] = useState<FilterPresetsState>({
    isExecuting: false,
    activePreset: null,
    results: null,
    error: null,
    processedData: initialData || [],
  });

  /**
   * Select a preset (only ONE at a time, like radio buttons)
   */
  const selectPreset = useCallback((presetId: string) => {
    setState((prev) => {
      const isCurrentActive = prev.activePreset === presetId;
      const newActivePreset = isCurrentActive ? null : presetId;

      return {
        ...prev,
        activePreset: newActivePreset,
      };
    });
  }, []);

  /**
   * Execute active preset on data
   */
  const executeActivePreset = useCallback(async () => {
    if (!initialData || initialData.length === 0) {
      setState((prev) => ({
        ...prev,
        error: 'No data available',
      }));
      return;
    }

    if (!state.activePreset) {
      setState((prev) => ({
        ...prev,
        processedData: initialData,
        results: null,
        error: null,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isExecuting: true,
      error: null,
    }));

    try {
      const result = executePreset(state.activePreset, initialData);

      console.log('✅ Preset Executed', {
        preset: state.activePreset,
        presetLabel: getPresetById(state.activePreset)?.label,
        rowsProcessed: result.rowsProcessed,
        rowsResult: result.rowsResult,
        summary: result.summary,
      });

      setState((prev) => ({
        ...prev,
        isExecuting: false,
        results: result,
        processedData: result.data,
        error: result.error || null,
      }));
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown error occurred';

      console.error('❌ Preset Execution Error:', errorMsg);

      setState((prev) => ({
        ...prev,
        isExecuting: false,
        error: errorMsg,
      }));
    }
  }, [initialData, state.activePreset]);

  /**
   * Clear active preset and reset to original data
   */
  const clearPresets = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activePreset: null,
      results: null,
      processedData: initialData || [],
      error: null,
    }));
  }, [initialData]);

  /**
   * Get preset details
   */
  const getActivePresetDetails = useCallback(() => {
    if (!state.activePreset) return [];
    const preset = FILTER_PRESETS.find((p) => p.id === state.activePreset);
    return preset ? [preset] : [];
  }, [state.activePreset]);

  /**
   * Calculate summary stats
   */
  const getSummaryStats = useCallback(() => {
    const processedCount = state.processedData.length;
    const originalCount = initialData?.length || 0;
    const reduced = originalCount - processedCount;

    return {
      originalRows: originalCount,
      processedRows: processedCount,
      rowsReduced: reduced,
      reductionPercent:
        originalCount > 0 ? Math.round((reduced / originalCount) * 100) : 0,
      totalAmount: state.processedData.reduce((sum, row) => {
        const amount =
          typeof row.total_amount === 'number'
            ? row.total_amount
            : parseFloat(String(row.total_amount || 0));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
    };
  }, [state.processedData, initialData]);

  return {
    ...state,
    selectPreset,
    executeActivePreset,
    clearPresets,
    getActivePresetDetails,
    getSummaryStats,
  };
}
