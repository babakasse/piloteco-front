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
  DataSourceFilter,
  EfficiencySummaryType,
  SiteFilterOptionsType
} from 'types/energy';

// ==============================|| API — ENERGY KPI ||============================== //

interface ExtraFilters {
  countryCodes?: string[];
  resourceCategories?: ResourceCategory[];
  resourceSubCategories?: string[];
  comparable?: ComparableFilter;
  dataSource?: DataSourceFilter;
  siteTypes?: string[];
  siteFormats?: string[];
  siteNames?: string[];
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

  if (extra.resourceSubCategories && extra.resourceSubCategories.length > 0) {
    for (const sub of extra.resourceSubCategories) params.append('resourceSubCategories[]', sub);
  }

  if (extra.comparable && extra.comparable !== 'all') {
    params.append('comparable', extra.comparable);
  }

  if (extra.dataSource && extra.dataSource !== 'total') {
    params.append('dataSource', extra.dataSource);
  }

  if (extra.siteTypes && extra.siteTypes.length > 0) {
    for (const t of extra.siteTypes) params.append('siteTypes[]', t);
  }

  if (extra.siteFormats && extra.siteFormats.length > 0) {
    for (const f of extra.siteFormats) params.append('siteFormats[]', f);
  }

  if (extra.siteNames && extra.siteNames.length > 0) {
    for (const n of extra.siteNames) params.append('siteNames[]', n);
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

interface RawEfficiencySummary {
  ytdAllElecKwh?: number | null;
  ytdAllGasNgKwh?: number | null;
  ytdAllGasHnKwh?: number | null;
  ytdAllWaterConsumedM3?: number | null;
  ytdAllWaterStoredM3?: number | null;
  ytdMagElecKwh?: number | null;
  ytdMagGasNgKwh?: number | null;
  ytdMagGasHnKwh?: number | null;
  ytdMagWaterConsumedM3?: number | null;
  ytdMagWaterStoredM3?: number | null;
  mtdAllElecKwh?: number | null;
  mtdAllGasNgKwh?: number | null;
  mtdAllGasHnKwh?: number | null;
  mtdAllWaterConsumedM3?: number | null;
  mtdAllWaterStoredM3?: number | null;
  mtdMagElecKwh?: number | null;
  mtdMagGasNgKwh?: number | null;
  mtdMagGasHnKwh?: number | null;
  mtdMagWaterConsumedM3?: number | null;
  mtdMagWaterStoredM3?: number | null;
}

export interface EfficiencySummaryResponseType {
  ytd: EfficiencySummaryType;
  mtd: EfficiencySummaryType;
}

export async function fetchEfficiencySummary(
  month: string,
  extra: ExtraFilters = {}
): Promise<EfficiencySummaryResponseType> {
  const params = buildParams({ month }, extra);
  const response = await axiosServices.get<RawEfficiencySummary[]>('/kpi/efficiency-summary', {
    params,
    headers: { Accept: 'application/json' }
  });
  const raw = response.data[0] ?? {};
  return {
    ytd: {
      all: {
        elecKwh: raw.ytdAllElecKwh ?? null,
        gasNgKwh: raw.ytdAllGasNgKwh ?? null,
        gasHnKwh: raw.ytdAllGasHnKwh ?? null,
        waterConsumedM3: raw.ytdAllWaterConsumedM3 ?? null,
        waterStoredM3: raw.ytdAllWaterStoredM3 ?? null
      },
      mag: {
        elecKwh: raw.ytdMagElecKwh ?? null,
        gasNgKwh: raw.ytdMagGasNgKwh ?? null,
        gasHnKwh: raw.ytdMagGasHnKwh ?? null,
        waterConsumedM3: raw.ytdMagWaterConsumedM3 ?? null,
        waterStoredM3: raw.ytdMagWaterStoredM3 ?? null
      }
    },
    mtd: {
      all: {
        elecKwh: raw.mtdAllElecKwh ?? null,
        gasNgKwh: raw.mtdAllGasNgKwh ?? null,
        gasHnKwh: raw.mtdAllGasHnKwh ?? null,
        waterConsumedM3: raw.mtdAllWaterConsumedM3 ?? null,
        waterStoredM3: raw.mtdAllWaterStoredM3 ?? null
      },
      mag: {
        elecKwh: raw.mtdMagElecKwh ?? null,
        gasNgKwh: raw.mtdMagGasNgKwh ?? null,
        gasHnKwh: raw.mtdMagGasHnKwh ?? null,
        waterConsumedM3: raw.mtdMagWaterConsumedM3 ?? null,
        waterStoredM3: raw.mtdMagWaterStoredM3 ?? null
      }
    }
  };
}

export async function fetchMonthlyIntensity(
  month: string,
  surfaceType: 'sales' | 'total',
  mode: 'ytd' | 'mtd',
  extra: ExtraFilters = {}
): Promise<MonthlyEvolutionItemType[]> {
  const params = buildParams({ month, surfaceType, mode }, extra);
  const response = await axiosServices.get<MonthlyEvolutionItemType[]>('/kpi/monthly-intensity', {
    params,
    headers: { Accept: 'application/json' }
  });
  return response.data;
}

export async function fetchSiteFilterOptions(): Promise<SiteFilterOptionsType> {
  const response = await axiosServices.get<SiteFilterOptionsType[]>('/kpi/site-filter-options', {
    headers: { Accept: 'application/json' }
  });
  const raw = Array.isArray(response.data) ? response.data[0] : response.data;
  return { siteTypes: raw?.siteTypes ?? [], siteFormats: raw?.siteFormats ?? [], siteNames: [] };
}
