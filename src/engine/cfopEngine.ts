/**
 * CFOP (Código Fiscal de Operação e Prestação) engine
 * Handles CFOP filtering and aggregation
 * Pure TypeScript - NO React dependencies
 */

import type { RowData } from '../types/milenium';

export interface CfopSummary {
  cfop: string;
  count: number;
  totalValue: number;
  rows: RowData[];
}

/**
 * Extracts all unique CFOP codes from dataset
 * Sorted in ascending order for consistent UI display
 *
 * @param data Array of Millenium export rows
 * @returns Sorted array of unique CFOP codes
 */
export function extractUniqueCfops(data: RowData[]): string[] {
  const cfopSet = new Set<string>();

  data.forEach((row) => {
    const cfop = row['Cfop'];
    if (cfop && typeof cfop === 'string') {
      cfopSet.add(cfop.trim());
    }
  });

  return Array.from(cfopSet).sort();
}

/**
 * Filters and aggregates data by selected CFOP codes
 * Returns summary with counts and totals for each CFOP
 *
 * @param data Array of Millenium export rows
 * @param selectedCfops Array of CFOP codes to filter by (empty = all)
 * @returns Array of CFOP summaries with aggregated data
 */
export function filterByCfops(
  data: RowData[],
  selectedCfops: string[]
): CfopSummary[] {
  // If no selection, use all CFOPs
  const cfopsToProcess =
    selectedCfops.length === 0
      ? extractUniqueCfops(data)
      : selectedCfops;

  const summaryMap = new Map<string, CfopSummary>();

  // Initialize summaries for each CFOP
  cfopsToProcess.forEach((cfop) => {
    summaryMap.set(cfop, {
      cfop,
      count: 0,
      totalValue: 0,
      rows: [],
    });
  });

  // Aggregate rows by CFOP
  data.forEach((row) => {
    const cfop = row['Cfop'];
    if (cfop && typeof cfop === 'string') {
      const cleanCfop = cfop.trim();

      if (cfopsToProcess.includes(cleanCfop)) {
        const summary = summaryMap.get(cleanCfop)!;
        summary.count += 1;
        summary.rows.push(row);

        // Sum valor (total value)
        const valor = row['Valor'];
        if (typeof valor === 'number') {
          summary.totalValue += valor;
        } else if (typeof valor === 'string') {
          const parsed = parseFloat(valor.replace(',', '.'));
          if (!isNaN(parsed)) {
            summary.totalValue += parsed;
          }
        }
      }
    }
  });

  // Return sorted by CFOP code
  return Array.from(summaryMap.values()).sort((a, b) =>
    a.cfop.localeCompare(b.cfop)
  );
}

/**
 * Gets detailed statistics for a specific CFOP
 *
 * @param cfopSummary The CFOP summary object
 * @returns Formatted statistics object
 */
export function getCfopStats(cfopSummary: CfopSummary) {
  return {
    cfop: cfopSummary.cfop,
    invoiceCount: cfopSummary.count,
    totalValue: cfopSummary.totalValue,
    averageValue:
      cfopSummary.count > 0
        ? cfopSummary.totalValue / cfopSummary.count
        : 0,
  };
}

/**
 * Formats currency value for Brazilian locale (pt-BR)
 * Example: 1500.50 -> "1.500,50"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}
