import axiosServices from 'utils/axios';
import { KpiSummaryType, MonthlyEvolutionItemType, SiteRankingItemType, ResourceCategory } from 'types/energy';

// ==============================|| API — ENERGY KPI ||============================== //

/**
 * Build URLSearchParams supporting repeated keys for array values.
 * e.g. countryCodes=['FR','ES'] → ?countryCodes[]=FR&countryCodes[]=ES
 */
function buildParams(base: Record<string, string | number | undefined>, countryCodes?: string[]): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }

  if (countryCodes && countryCodes.length > 0) {
    for (const code of countryCodes) {
      params.append('countryCodes[]', code);
    }
  }

  return params;
}

export async function fetchKpiSummary(
  resourceCategory: ResourceCategory,
  month: string,
  countryCodes?: string[]
): Promise<KpiSummaryType[]> {
  const params = buildParams({ resourceCategory, month }, countryCodes);

  const response = await axiosServices.get<KpiSummaryType[]>('/kpi/summary', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchMonthlyEvolution(
  resourceCategory: ResourceCategory,
  year: number,
  countryCodes?: string[]
): Promise<MonthlyEvolutionItemType[]> {
  const params = buildParams({ resourceCategory, year }, countryCodes);

  const response = await axiosServices.get<MonthlyEvolutionItemType[]>('/kpi/monthly-evolution', {
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
  countryCodes?: string[]
): Promise<SiteRankingItemType[]> {
  const params = buildParams({ resourceCategory, month, limit, order }, countryCodes);

  const response = await axiosServices.get<SiteRankingItemType[]>('/kpi/site-ranking', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}
