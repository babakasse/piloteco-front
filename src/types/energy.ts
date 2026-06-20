// ==============================|| TYPES — ENERGY KPI ||============================== //

export type ResourceCategory = 'ELEC' | 'GAS' | 'WATER';

export interface KpiSummaryType {
  resourceCategory: ResourceCategory;
  month: string;
  totalConsumptionMtd: number;
  totalConsumptionYtd?: number;
  energyIntensityMtd?: number;
  energyIntensityYtd?: number;
  evolutionMtdVsN1Percent?: number;
  evolutionYtdVsN1Percent?: number;
  refrigerantTotalYtdKg?: number;
}

export interface MonthlyEvolutionItemType {
  month: string;
  current?: number;
  previous?: number;
  evolutionPercent?: number;
}

export interface SiteRankingItemType {
  rank: number;
  siteUniqueCode: string;
  countryCode: string;
  intensity: number;
}

export interface EnergyFiltersType {
  resourceCategory: ResourceCategory;
  month: string;
  year: number;
  countryCode?: string;
}
