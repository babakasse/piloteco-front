import axiosServices from 'utils/axios';
import { KpiSummaryType, MonthlyEvolutionItemType, SiteRankingItemType, ResourceCategory } from 'types/energy';

// ==============================|| API — ENERGY KPI ||============================== //

export async function fetchKpiSummary(resourceCategory: ResourceCategory, month: string, countryCode?: string): Promise<KpiSummaryType[]> {
  const params: Record<string, string> = { resourceCategory, month };
  if (countryCode) params['countryCode'] = countryCode;

  const response = await axiosServices.get<KpiSummaryType[]>('/kpi/summary', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

export async function fetchMonthlyEvolution(
  resourceCategory: ResourceCategory,
  year: number,
  countryCode?: string
): Promise<MonthlyEvolutionItemType[]> {
  const params: Record<string, string | number> = { resourceCategory, year };
  if (countryCode) params['countryCode'] = countryCode;

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
  countryCode?: string
): Promise<SiteRankingItemType[]> {
  const params: Record<string, string | number> = { resourceCategory, month, limit, order };
  if (countryCode) params['countryCode'] = countryCode;

  const response = await axiosServices.get<SiteRankingItemType[]>('/kpi/site-ranking', {
    params,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}
