/**
 * Preset Engine - Execution layer
 * Applies selected preset filters and aggregations to dataset
 */

import type { RowData } from '../types/milenium';
import {
  normalizeNumber,
  normalizeString,
  hasValidDocument,
  hasStock,
} from './filterPresets';

/**
 * Result of a preset execution
 */
export interface PresetExecutionResult {
  preset: string;
  success: boolean;
  rowsProcessed: number;
  rowsResult: number;
  data: RowData[];
  summary: Record<string, unknown>;
  error?: string;
}

/**
 * Execute TOTAL_BY_TAX_ID preset
 * Groups by tax_id/cpf_cnpj and sums total_amount
 */
export function executeTotalByTaxId(data: RowData[]): PresetExecutionResult {
  const grouped = new Map<string, { total: number; count: number }>();

  data.forEach((row) => {
    const taxId = normalizeString(row.tax_id || row.cpf_cnpj);
    if (!taxId) return; // Skip empty

    const amount = normalizeNumber(row.total_amount);
    const existing = grouped.get(taxId) || { total: 0, count: 0 };
    grouped.set(taxId, {
      total: existing.total + amount,
      count: existing.count + 1,
    });
  });

  // Convert to result rows
  const resultRows = Array.from(grouped.entries()).map(([taxId, agg]) => ({
    tax_id: taxId,
    cpf_cnpj: taxId,
    total_amount: agg.total,
    row_count: agg.count,
  }));

  return {
    preset: 'TOTAL_BY_TAX_ID',
    success: true,
    rowsProcessed: data.length,
    rowsResult: resultRows.length,
    data: resultRows,
    summary: {
      unique_documents: resultRows.length,
      total_sum: resultRows.reduce(
        (sum, row) => sum + normalizeNumber(row.total_amount),
        0
      ),
    },
  };
}

/**
 * Execute TOTAL_BY_BRANCH preset
 * Groups by branch_id/filial and sums total_amount
 */
export function executeTotalByBranch(data: RowData[]): PresetExecutionResult {
  const grouped = new Map<string, { total: number; count: number }>();

  data.forEach((row) => {
    const branch = normalizeString(row.branch_id || row.filial);
    if (!branch) return; // Skip empty

    const amount = normalizeNumber(row.total_amount);
    const existing = grouped.get(branch) || { total: 0, count: 0 };
    grouped.set(branch, {
      total: existing.total + amount,
      count: existing.count + 1,
    });
  });

  // Convert to result rows
  const resultRows = Array.from(grouped.entries()).map(([branch, agg]) => ({
    branch_id: branch,
    filial: branch,
    total_amount: agg.total,
    row_count: agg.count,
  }));

  return {
    preset: 'TOTAL_BY_BRANCH',
    success: true,
    rowsProcessed: data.length,
    rowsResult: resultRows.length,
    data: resultRows,
    summary: {
      unique_branches: resultRows.length,
      total_sum: resultRows.reduce(
        (sum, row) => sum + normalizeNumber(row.total_amount),
        0
      ),
    },
  };
}

/**
 * Execute HIDE_ZERO_STOCK preset
 * Removes records with zero or negative stock_qty
 */
export function executeHideZeroStock(data: RowData[]): PresetExecutionResult {
  const filtered = data.filter((row) => hasStock(row));

  const removed = data.length - filtered.length;

  return {
    preset: 'HIDE_ZERO_STOCK',
    success: true,
    rowsProcessed: data.length,
    rowsResult: filtered.length,
    data: filtered,
    summary: {
      rows_removed: removed,
      rows_with_stock: filtered.length,
    },
  };
}

/**
 * Execute INVALID_DOCUMENT_CHECK preset
 * Filters rows with missing or invalid CPF/CNPJ format
 */
export function executeInvalidDocumentCheck(
  data: RowData[]
): PresetExecutionResult {
  const filtered = data.filter((row) => hasValidDocument(row));

  const removed = data.length - filtered.length;

  return {
    preset: 'INVALID_DOCUMENT_CHECK',
    success: true,
    rowsProcessed: data.length,
    rowsResult: filtered.length,
    data: filtered,
    summary: {
      invalid_rows_removed: removed,
      valid_rows: filtered.length,
    },
  };
}

/**
 * Execute a preset by ID
 */
export function executePreset(
  presetId: string,
  data: RowData[]
): PresetExecutionResult {
  if (!data || data.length === 0) {
    return {
      preset: presetId,
      success: false,
      rowsProcessed: 0,
      rowsResult: 0,
      data: [],
      summary: {},
      error: 'No data provided',
    };
  }

  try {
    switch (presetId) {
      case 'TOTAL_BY_TAX_ID':
        return executeTotalByTaxId(data);
      case 'TOTAL_BY_BRANCH':
        return executeTotalByBranch(data);
      case 'HIDE_ZERO_STOCK':
        return executeHideZeroStock(data);
      case 'INVALID_DOCUMENT_CHECK':
        return executeInvalidDocumentCheck(data);
      default:
        return {
          preset: presetId,
          success: false,
          rowsProcessed: data.length,
          rowsResult: 0,
          data: [],
          summary: {},
          error: `Unknown preset: ${presetId}`,
        };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      preset: presetId,
      success: false,
      rowsProcessed: data.length,
      rowsResult: 0,
      data: [],
      summary: {},
      error: errorMsg,
    };
  }
}

/**
 * Execute multiple presets in sequence
 */
export function executePresets(
  presetIds: string[],
  data: RowData[]
): PresetExecutionResult[] {
  const results: PresetExecutionResult[] = [];
  let currentData = [...data];

  for (const presetId of presetIds) {
    const result = executePreset(presetId, currentData);
    results.push(result);

    if (result.success) {
      currentData = result.data;
    } else {
      // If a preset fails, stop execution
      break;
    }
  }

  return results;
}
