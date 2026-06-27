// ==============================|| TYPES — ENERGY KPI ||============================== //

export type ResourceCategory = 'ELEC' | 'GAS' | 'WATER';

export type ComparableFilter = 'all' | 'comparable' | 'non-comparable';
export type DataSourceFilter = 'total' | 'real';

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
  // Surface metrics
  salesSurfaceM2?: number;
  totalSurfaceM2?: number;
  // Intensity by surface type (YTD)
  commercialEnergyIntensityYtd?: number;
  buildingEnergyIntensityYtd?: number;
  // Green electricity (ELEC only)
  greenElectricityConsumptionKwh?: number;
  greenElectricityConsumptionPercent?: number;
  greenElectricityProductionKwh?: number;
  greenElectricityProductionPercent?: number;
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

export interface CountryIntensityItemType {
  countryCode: string;
  intensity: number | null;
  totalConsumptionKwh: number | null;
  totalAreaM2: number | null;
}

export interface CountryIntensityMonthlyItemType {
  id: string;
  month: string;
  countryCode: string;
  intensity: number | null;
  totalKwh: number;
}

export interface RefrigerantByCountryItemType {
  countryCode: string;
  totalKg: number;
  quarterStart: string;
  quarterEnd: string;
}

export interface RefrigerantByQuarterItemType {
  id: string;
  quarter: string;
  quarterStart: string;
  quarterEnd: string;
  countryCode: string;
  totalKg: number;
}

export interface RefrigerantBreakdownItemType {
  fluidType: string;
  totalKg: number;
  percentage: number;
}

export interface EnergyFiltersType {
  /** Primary resource (used when no multi-selection) */
  resourceCategory: ResourceCategory;
  /** Multi-resource override — when set, overrides resourceCategory */
  resourceCategories?: ResourceCategory[];
  resourceSubCategory?: string;
  comparable?: ComparableFilter;
  dataSource?: DataSourceFilter;
  month: string;
  year: number;
  /** Multi-country filter — empty array or undefined = all countries */
  countryCodes?: string[];
  siteTypes?: string[];
  siteFormats?: string[];
  siteNames?: string[];
}

// ── Efficiency page ───────────────────────────────────────────────────────────

export interface EfficiencyConsumptionBucketType {
  elecKwh: number | null;
  gasNgKwh: number | null;
  gasHnKwh: number | null;
  waterConsumedM3: number | null;
  waterStoredM3: number | null;
}

export interface EfficiencySummaryType {
  all: EfficiencyConsumptionBucketType;
  mag: EfficiencyConsumptionBucketType;
}

export interface SiteFilterOptionsType {
  siteTypes: string[];
  siteFormats: string[];
  siteNames: string[];
}
