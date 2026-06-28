import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from 'contexts/LanguageContext';
import {
  fetchKpiSummary,
  fetchMonthlyEvolution,
  fetchSiteRanking,
  fetchRefrigerantByCountry,
  fetchRefrigerantByQuarter,
  fetchRefrigerantBreakdown
} from 'api/energyApi';
import {
  KpiSummaryType,
  MonthlyEvolutionItemType,
  SiteRankingItemType,
  RefrigerantByCountryItemType,
  RefrigerantByQuarterItemType,
  RefrigerantBreakdownItemType,
  EnergyFiltersType
} from 'types/energy';

// ==============================|| HOOK — ENERGY KPI ||============================== //

interface UseEnergyKpisState {
  summary: KpiSummaryType | null;
  monthlyEvolution: MonthlyEvolutionItemType[];
  topSites: SiteRankingItemType[];
  flopSites: SiteRankingItemType[];
  refrigerantByCountry: RefrigerantByCountryItemType[];
  refrigerantByQuarter: RefrigerantByQuarterItemType[];
  refrigerantBreakdown: RefrigerantBreakdownItemType[];
  loading: boolean;
  error: string | null;
}

export function useEnergyKpis(filters: EnergyFiltersType): UseEnergyKpisState & { reload: () => void } {
  const { t } = useLanguage();
  const [state, setState] = useState<UseEnergyKpisState>({
    summary: null,
    monthlyEvolution: [],
    topSites: [],
    flopSites: [],
    refrigerantByCountry: [],
    refrigerantByQuarter: [],
    refrigerantBreakdown: [],
    loading: false,
    error: null
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const extra = {
        countryCodes: filters.countryCodes && filters.countryCodes.length > 0 ? filters.countryCodes : undefined,
        resourceCategories: filters.resourceCategories && filters.resourceCategories.length > 0
          ? filters.resourceCategories
          : undefined,
        resourceSubCategories: filters.resourceSubCategories,
        comparable: filters.comparable,
        dataSource: filters.dataSource
      };

      const [
        summaryData,
        evolution,
        top,
        flop,
        refrigerantData,
        refrigerantByQuarterData,
        refrigerantBreakdownData
      ] = await Promise.all([
        fetchKpiSummary(filters.resourceCategory, filters.month, extra),
        fetchMonthlyEvolution(filters.resourceCategory, filters.year, filters.month, extra),
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'ASC', extra),
        fetchSiteRanking(filters.resourceCategory, filters.month, 10, 'DESC', extra),
        fetchRefrigerantByCountry(filters.month, extra),
        fetchRefrigerantByQuarter(filters.month, extra),
        fetchRefrigerantBreakdown(filters.month, extra)
      ]);

      setState({
        summary: summaryData[0] ?? null,
        monthlyEvolution: evolution,
        topSites: top,
        flopSites: flop,
        refrigerantByCountry: refrigerantData,
        refrigerantByQuarter: refrigerantByQuarterData,
        refrigerantBreakdown: refrigerantBreakdownData,
        loading: false,
        error: null
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: t('energy-kpi-load-error') }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.resourceCategory,
    filters.month,
    filters.year,
    JSON.stringify(filters.countryCodes),
    JSON.stringify(filters.resourceCategories),
    JSON.stringify(filters.resourceSubCategories),
    filters.comparable,
    filters.dataSource
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
