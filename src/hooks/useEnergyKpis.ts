import { useState, useEffect, useCallback } from 'react';
import { fetchKpiSummary, fetchMonthlyEvolution, fetchSiteRanking, fetchCountryIntensity, fetchRefrigerantByCountry } from 'api/energyApi';
import {
  KpiSummaryType,
  MonthlyEvolutionItemType,
  SiteRankingItemType,
  CountryIntensityItemType,
  RefrigerantByCountryItemType,
  EnergyFiltersType
} from 'types/energy';

// ==============================|| HOOK — ENERGY KPI ||============================== //

interface UseEnergyKpisState {
  summary: KpiSummaryType | null;
  monthlyEvolution: MonthlyEvolutionItemType[];
  topSites: SiteRankingItemType[];
  flopSites: SiteRankingItemType[];
  countryIntensity: CountryIntensityItemType[];
  refrigerantByCountry: RefrigerantByCountryItemType[];
  loading: boolean;
  error: string | null;
}

export function useEnergyKpis(filters: EnergyFiltersType): UseEnergyKpisState & { reload: () => void } {
  const [state, setState] = useState<UseEnergyKpisState>({
    summary: null,
    monthlyEvolution: [],
    topSites: [],
    flopSites: [],
    countryIntensity: [],
    refrigerantByCountry: [],
    loading: false,
    error: null
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const codes = filters.countryCodes && filters.countryCodes.length > 0 ? filters.countryCodes : undefined;

      const [summaryData, evolution, top, flop, countryIntensityData, refrigerantData] = await Promise.all([
        fetchKpiSummary(filters.resourceCategory, filters.month, codes),
        fetchMonthlyEvolution(filters.resourceCategory, filters.year, codes),
        // Top = lowest intensity (most energy-efficient sites) → ASC
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'ASC', codes),
        // Flop = highest intensity (worst energy consumers) → DESC
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'DESC', codes),
        fetchCountryIntensity(filters.resourceCategory, filters.month, codes),
        fetchRefrigerantByCountry(filters.month, codes)
      ]);

      setState({
        summary: summaryData[0] ?? null,
        monthlyEvolution: evolution,
        topSites: top,
        flopSites: flop,
        countryIntensity: countryIntensityData,
        refrigerantByCountry: refrigerantData,
        loading: false,
        error: null
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Erreur lors du chargement des KPI.' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.resourceCategory, filters.month, filters.year, JSON.stringify(filters.countryCodes)]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
