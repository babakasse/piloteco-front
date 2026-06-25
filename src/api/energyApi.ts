import axiosServices from 'utils/axios';
import {
  KpiSummaryType,
  MonthlyEvolutionItemType,
  SiteRankingItemType,
  CountryIntensityItemType,
  CountryIntensityMonthlyItemType,
  RefrigerantByCountryItemType,
  RefrigerantByQuarterItemType,
  RefrigerantBreakdownItemType,
  ResourceCategory,
  ComparableFilter,
  DataSourceFilter
} from 'types/energy';

// ==============================|| API — ENERGY KPI ||============================== //

interface ExtraFilters {
  countryCodes?: string[];
  resourceCategories?: ResourceCategory[];
  resourceSubCategory?: string;
  comparable?: ComparableFilter;
  dataSource?: DataSourceFilter;
}

/**
 * Build URLSearchParams supporting repeated keys for array values.
 * e.g. countryCodes=['FR','ES'] → ?countryCodes[]=FR&countryCodes[]=ES
 */
function buildParams(
  base: Record<string, string | number | undefined>,
  extra: ExtraFilters = {}
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }

  if (extra.countryCodes && extra.countryCodes.length > 0) {
    for (const code of extra.countryCodes) {
      params.append('countryCodes[]', code);
    }
  }

  if (extra.resourceCategories && extra.resourceCategories.length > 0) {
    for (const cat of extra.resourceCategories) {
      params.append('resourceCategories[]', cat);
    }
  }

  if (extra.resourceSubCategory) {
    params.append('resourceSubCategory', extra.resourceSubCategory);
  }

  if (extra.comparable && extra.comparable !== 'all') {
    params.append('comparable', extra.comparable);
  }

  if (extra.dataSource && extra.dataSource !== 'total') {
    params.append('dataSource', extra.dataSource);
  }

  return params;
}

export async function fetchKpiSummary(
  resourceCategory: ResourceCategory,
  month: string,
  extra: ExtraFilters = {}
): Promise<KpiSummaryType[]> {
  const params = buildParams({ resourceCategory, month }, extra);

  const response = await axiosServices.get<KpiSummaryType[]>('/kpi/summary', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchMonthlyEvolution(
  resourceCategory: ResourceCategory,
  year: number,
  month: string,
  extra: ExtraFilters = {}
): Promise<MonthlyEvolutionItemType[]> {
  const params = buildParams({ resourceCategory, year, month }, extra);

  const response = await axiosServices.get<MonthlyEvolutionItemType[]>('/kpi/monthly-evolution', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchCountryIntensity(
  resourceCategory: ResourceCategory,
  month: string,
  extra: ExtraFilters = {}
): Promise<CountryIntensityItemType[]> {
  const params = buildParams({ resourceCategory, month }, extra);

  const response = await axiosServices.get<CountryIntensityItemType[]>('/kpi/country-intensity', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchCountryIntensityMonthly(
  resourceCategory: ResourceCategory,
  year: number,
  extra: ExtraFilters = {}
): Promise<CountryIntensityMonthlyItemType[]> {
  const params = buildParams({ resourceCategory, year }, extra);

  const response = await axiosServices.get<CountryIntensityMonthlyItemType[]>('/kpi/country-intensity-monthly', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchRefrigerantByCountry(
  month: string,
  extra: ExtraFilters = {}
): Promise<RefrigerantByCountryItemType[]> {
  const params = buildParams({ month }, extra);

  const response = await axiosServices.get<RefrigerantByCountryItemType[]>('/kpi/refrigerant-by-country', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchRefrigerantByQuarter(
  month: string,
  extra: ExtraFilters = {}
): Promise<RefrigerantByQuarterItemType[]> {
  const params = buildParams({ month }, extra);

  const response = await axiosServices.get<RefrigerantByQuarterItemType[]>('/kpi/refrigerant-by-quarter', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchRefrigerantBreakdown(
  month: string,
  extra: ExtraFilters = {}
): Promise<RefrigerantBreakdownItemType[]> {
  const params = buildParams({ month }, extra);

  const response = await axiosServices.get<RefrigerantBreakdownItemType[]>('/kpi/refrigerant-breakdown', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchSiteRanking(
  resourceCategory: ResourceCategory,
  month: string,
  limit = 10,
  order: 'DESC' | 'ASC' = 'DESC',
  extra: ExtraFilters = {}
): Promise<SiteRankingItemType[]> {
  const params = buildParams({ resourceCategory, month, limit, order }, extra);

  const response = await axiosServices.get<SiteRankingItemType[]>('/kpi/site-ranking', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}
