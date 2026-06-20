import { useState, useEffect, useCallback } from 'react';
import { fetchKpiSummary, fetchMonthlyEvolution, fetchSiteRanking } from 'api/energyApi';
import { KpiSummaryType, MonthlyEvolutionItemType, SiteRankingItemType, EnergyFiltersType } from 'types/energy';

// ==============================|| HOOK — ENERGY KPI ||============================== //

interface UseEnergyKpisState {
  summary: KpiSummaryType | null;
  monthlyEvolution: MonthlyEvolutionItemType[];
  topSites: SiteRankingItemType[];
  flopSites: SiteRankingItemType[];
  loading: boolean;
  error: string | null;
}

export function useEnergyKpis(filters: EnergyFiltersType): UseEnergyKpisState & { reload: () => void } {
  const [state, setState] = useState<UseEnergyKpisState>({
    summary: null,
    monthlyEvolution: [],
    topSites: [],
    flopSites: [],
    loading: false,
    error: null
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [summaryData, evolution, top, flop] = await Promise.all([
        fetchKpiSummary(filters.resourceCategory, filters.month, filters.countryCode),
        fetchMonthlyEvolution(filters.resourceCategory, filters.year, filters.countryCode),
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'DESC', filters.countryCode),
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'ASC', filters.countryCode)
      ]);

      setState({
        summary: summaryData[0] ?? null,
        monthlyEvolution: evolution,
        topSites: top,
        flopSites: flop,
        loading: false,
        error: null
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Erreur lors du chargement des KPI.' }));
    }
  }, [filters.resourceCategory, filters.month, filters.year, filters.countryCode]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
