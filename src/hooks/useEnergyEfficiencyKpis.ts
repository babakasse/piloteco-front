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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const extra = {
    countryCodes: filters.countryCodes,
    comparable: filters.comparable,
    dataSource: filters.dataSource,
    resourceSubCategories: filters.resourceSubCategories,
    siteTypes: filters.siteTypes,
    siteFormats: filters.siteFormats
  };

  // Stringify the entire filter set for stable dependency comparison
  const filterKey = JSON.stringify({ month: filters.month, year: filters.year, ...extra });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summary, kpiArr, sy, sm, ty, tm, opts] = await Promise.all([
          fetchEfficiencySummary(filters.month, extra),
          fetchKpiSummary('ELEC', filters.month, extra),
          fetchMonthlyIntensity(filters.month, 'sales', 'ytd', extra),
          fetchMonthlyIntensity(filters.month, 'sales', 'mtd', extra),
          fetchMonthlyIntensity(filters.month, 'total', 'ytd', extra),
          fetchMonthlyIntensity(filters.month, 'total', 'mtd', extra),
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
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
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
