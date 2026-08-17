/**
 * Milenium Filter Presets
 * Hardcoded business rules for data aggregation and filtering
 */

import type { RowData } from '../types/milenium';

/**
 * Preset definition interface
 */
export interface FilterPreset {
  id: string;
  label: string;
  description: string;
  category: 'aggregation' | 'filter';
}

/**
 * Hardcoded preset registry
 * These are the one-click business logic filters
 */
export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'TOTAL_BY_TAX_ID',
    label: 'Sum Totals by CPF/CNPJ',
    description: 'Groups rows by tax_id (CPF/CNPJ) and sums total_amount',
    category: 'aggregation',
  },
  {
    id: 'TOTAL_BY_BRANCH',
    label: 'Sum Totals by Branch',
    description: 'Groups rows by branch_id (filial) and sums total_amount',
    category: 'aggregation',
  },
  {
    id: 'HIDE_ZERO_STOCK',
    label: 'Hide Out of Stock',
    description: 'Removes records with zero or negative stock_qty',
    category: 'filter',
  },
  {
    id: 'INVALID_DOCUMENT_CHECK',
    label: 'Show Invalid Documents',
    description: 'Filters rows with missing or invalid CPF/CNPJ format',
    category: 'filter',
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): FilterPreset | undefined {
  return FILTER_PRESETS.find((p) => p.id === id);
}

/**
 * Get all aggregation presets
 */
export function getAggregationPresets(): FilterPreset[] {
  return FILTER_PRESETS.filter((p) => p.category === 'aggregation');
}

/**
 * Get all filter presets
 */
export function getFilterPresets(): FilterPreset[] {
  return FILTER_PRESETS.filter((p) => p.category === 'filter');
}

/**
 * Normalize numeric value from row
 */
export function normalizeNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Normalize string value from row
 */
export function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value);
}

/**
 * Check if document looks valid (basic check)
 */
export function hasValidDocument(row: RowData): boolean {
  const taxId = normalizeString(row.tax_id || row.cpf_cnpj);
  const cpfCnpj = normalizeString(row.cpf_cnpj);

  // Both empty = invalid
  if (!taxId && !cpfCnpj) return false;

  // Valid if at least one has digits
  const hasDigits = /\d/.test(taxId + cpfCnpj);
  return hasDigits;
}

/**
 * Validate stock quantity
 */
export function hasStock(row: RowData): boolean {
  const stock = normalizeNumber(row.stock_qty);
  return stock > 0;
}
