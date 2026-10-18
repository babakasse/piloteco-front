import { useState, useEffect } from 'react';
import {
  fetchEfficiencySummary,
  fetchKpiSummary,
  fetchMonthlyIntensity,
  fetchSiteFilterOptions
} from 'api/energyApi';
import {
  EnergyFiltersType,
  KpiSummaryType,
  MonthlyEvolutionItemType,
  SiteFilterOptionsType
} from 'types/energy';
import { EfficiencySummaryResponseType } from 'api/energyApi';
import { TranslationKeys } from 'locales';

// ==============================|| HOOK — ENERGY EFFICIENCY KPIs ||============================== //

interface UseEnergyEfficiencyKpisResult {
  efficiencySummary: EfficiencySummaryResponseType | null;
  kpiSummary: KpiSummaryType | null;
  salesYtd: MonthlyEvolutionItemType[];
  salesMtd: MonthlyEvolutionItemType[];
  totalYtd: MonthlyEvolutionItemType[];
  totalMtd: MonthlyEvolutionItemType[];
  filterOptions: SiteFilterOptionsType;
  loading: boolean;
  error: TranslationKeys | null;
}

export function useEnergyEfficiencyKpis(filters: EnergyFiltersType): UseEnergyEfficiencyKpisResult {
  const [efficiencySummary, setEfficiencySummary] = useState<EfficiencySummaryResponseType | null>(null);
  const [kpiSummary, setKpiSummary] = useState<KpiSummaryType | null>(null);
  const [salesYtd, setSalesYtd] = useState<MonthlyEvolutionItemType[]>([]);
  const [salesMtd, setSalesMtd] = useState<MonthlyEvolutionItemType[]>([]);
  const [totalYtd, setTotalYtd] = useState<MonthlyEvolutionItemType[]>([]);
  const [totalMtd, setTotalMtd] = useState<MonthlyEvolutionItemType[]>([]);
  const [filterOptions, setFilterOptions] = useState<SiteFilterOptionsType>({ siteTypes: [], siteFormats: [], siteNames: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TranslationKeys | null>(null);

  const extra = {
    countryCodes: filters.countryCodes,
    resourceCategories: filters.resourceCategories ?? [filters.resourceCategory],
    comparable: filters.comparable,
    dataSource: filters.dataSource,
    resourceSubCategories: filters.resourceSubCategories,
    siteTypes: filters.siteTypes,
    siteFormats: filters.siteFormats
  };

  // Stringify the entire filter set for stable dependency comparison
  const filterKey = JSON.stringify({
    month: filters.month,
    year: filters.year,
    resourceCategory: filters.resourceCategory,
    ...extra
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summary, kpiArr, sy, sm, ty, tm, opts] = await Promise.all([
          fetchEfficiencySummary(filters.resourceCategory, filters.month, extra),
          fetchKpiSummary(filters.resourceCategory, filters.month, extra),
          fetchMonthlyIntensity(filters.resourceCategory, filters.month, 'sales', 'ytd', extra),
          fetchMonthlyIntensity(filters.resourceCategory, filters.month, 'sales', 'mtd', extra),
          fetchMonthlyIntensity(filters.resourceCategory, filters.month, 'total', 'ytd', extra),
          fetchMonthlyIntensity(filters.resourceCategory, filters.month, 'total', 'mtd', extra),
          fetchSiteFilterOptions()
        ]);

        if (cancelled) return;

        setEfficiencySummary(summary);
        setKpiSummary(kpiArr[0] ?? null);
        setSalesYtd(sy);
        setSalesMtd(sm);
        setTotalYtd(ty);
        setTotalMtd(tm);
        setFilterOptions({ siteTypes: opts.siteTypes ?? [], siteFormats: opts.siteFormats ?? [], siteNames: [] });
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load energy efficiency KPIs', err);
          setError('energy-kpi-load-error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { efficiencySummary, kpiSummary, salesYtd, salesMtd, totalYtd, totalMtd, filterOptions, loading, error };
}
