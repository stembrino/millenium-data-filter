/**
 * Hook for managing Série multi-select filter state.
 */

import { useCallback, useMemo, useState } from 'react';
import {
  extractUniqueSeries,
  filterBySeries,
} from '../engine/seriesFilterEngine';
import type { RowData } from '../types/milenium';
import type { SeriesSummary } from '../engine/seriesFilterEngine';

export interface SeriesFilterState {
  selectedSeries: string[];
  seriesSummaries: SeriesSummary[];
}

interface UseSeriesFilterReturn {
  seriesFilter: SeriesFilterState;
  toggleSerie: (serie: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export function useSeriesFilter(data: RowData[]): UseSeriesFilterReturn {
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);

  const seriesSummaries = useMemo(() => {
    if (selectedSeries.length === 0) {
      return [];
    }

    return filterBySeries(data, selectedSeries);
  }, [data, selectedSeries]);

  const toggleSerie = useCallback((serie: string) => {
    setSelectedSeries((prev) => {
      const isSelected = prev.includes(serie);
      return isSelected
        ? prev.filter((item) => item !== serie)
        : [...prev, serie];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedSeries(extractUniqueSeries(data));
  }, [data]);

  const deselectAll = useCallback(() => {
    setSelectedSeries([]);
  }, []);

  return {
    seriesFilter: {
      selectedSeries,
      seriesSummaries,
    },
    toggleSerie,
    selectAll,
    deselectAll,
  };
}
