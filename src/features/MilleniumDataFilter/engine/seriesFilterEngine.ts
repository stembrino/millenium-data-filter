/**
 * Série filter engine.
 * Keeps the logic decoupled from the UI and reusable like the CFOP filter.
 */

import type { RowData } from '../types/milenium';

export interface SeriesSummary {
  serie: string;
  count: number;
  totalValue: number;
  rows: RowData[];
}

export function normalizeSerieValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

export function extractUniqueSeries(data: RowData[]): string[] {
  const seriesSet = new Set<string>();

  data.forEach((row) => {
    const value = normalizeSerieValue(row['Série']);
    if (value) {
      seriesSet.add(value);
    }
  });

  return Array.from(seriesSet).sort((a, b) => a.localeCompare(b));
}

export function filterBySeries(
  data: RowData[],
  selectedSeries: string[]
): SeriesSummary[] {
  const seriesToProcess =
    selectedSeries.length === 0 ? extractUniqueSeries(data) : selectedSeries;

  const summaryMap = new Map<string, SeriesSummary>();

  seriesToProcess.forEach((serie) => {
    summaryMap.set(serie, {
      serie,
      count: 0,
      totalValue: 0,
      rows: [],
    });
  });

  data.forEach((row) => {
    const serie = normalizeSerieValue(row['Série']);
    if (!serie) {
      return;
    }

    if (!seriesToProcess.includes(serie)) {
      return;
    }

    const summary = summaryMap.get(serie);
    if (!summary) {
      return;
    }

    summary.count += 1;
    summary.rows.push(row);

    const valor = row['Valor'];
    if (typeof valor === 'number') {
      summary.totalValue += valor;
    } else if (typeof valor === 'string') {
      const parsed = parseFloat(valor.replace(',', '.'));
      if (!isNaN(parsed)) {
        summary.totalValue += parsed;
      }
    }
  });

  return Array.from(summaryMap.values()).sort((a, b) =>
    a.serie.localeCompare(b.serie)
  );
}
