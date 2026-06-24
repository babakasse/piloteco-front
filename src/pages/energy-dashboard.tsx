import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import MainCard from 'components/MainCard';
import { useEnergyKpis } from 'hooks/useEnergyKpis';
import { useLanguage } from 'contexts/LanguageContext';
import { EnergyFiltersType } from 'types/energy';

import DashboardFilters from 'sections/energy/DashboardFilters';
import CountryChips from 'sections/energy/CountryChips';
import KpiSummaryPanel from 'sections/energy/KpiSummaryPanel';
import EnergyIntensityYtdChart from 'sections/energy/EnergyIntensityYtdChart';
import HorizontalRankingChart from 'sections/energy/HorizontalRankingChart';
import CountryIntensityChart from 'sections/energy/CountryIntensityChart';
import CountryIntensityMonthlyChart from 'sections/energy/CountryIntensityMonthlyChart';
import RefrigerantByQuarterChart from 'sections/energy/RefrigerantByQuarterChart';
import RefrigerantBreakdownChart from 'sections/energy/RefrigerantBreakdownChart';

// ==============================|| PAGE — ENERGY DASHBOARD ||============================== //

// Default to the latest month with available data
const DEFAULT_YEAR = 2025;
const DEFAULT_MONTH = '2025-12';

export default function EnergyDashboard() {
  const { t } = useLanguage();

  const [filters, setFilters] = useState<EnergyFiltersType>({
    resourceCategory: 'ELEC',
    month: DEFAULT_MONTH,
    year: DEFAULT_YEAR
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  function handleCountryChipsChange(codes: string[]) {
    setSelectedCountries(codes);
    setFilters((prev) => ({ ...prev, countryCodes: codes.length > 0 ? codes : undefined }));
  }

  const {
    summary,
    monthlyEvolution,
    topSites,
    flopSites,
    countryIntensity,
    countryIntensityMonthly,
    refrigerantByQuarter,
    refrigerantBreakdown,
    loading,
    error
  } = useEnergyKpis(filters);

  return (
    <Box>
      {/* Top filters bar */}
      <MainCard sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <DashboardFilters filters={filters} onChange={setFilters} />
          <Divider />
          <CountryChips selected={selectedCountries} onChange={handleCountryChipsChange} />
        </Stack>
      </MainCard>

      {/* Loading / error */}
      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>
          {/* ── Row 1 : KPI panel (left) + Energy intensity YTD chart (right) ── */}
          <Grid item xs={12} md={5}>
            <MainCard sx={{ height: '100%' }}>
              <KpiSummaryPanel summary={summary} />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <MainCard sx={{ height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t('energy-intensity-surface-ytd')} — {filters.year}
              </Typography>
              <EnergyIntensityYtdChart data={monthlyEvolution} year={filters.year} />
            </MainCard>
          </Grid>

          {/* ── Row 2 : Intensity MTD by country (left) + Intensity YTD per sales surface (right) ── */}
          <Grid item xs={12} md={6}>
            <MainCard>
              <CountryIntensityChart
                data={countryIntensity}
                title={`${t('energy-intensity-by-country')} — MTD`}
              />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MainCard>
              <CountryIntensityMonthlyChart
                data={countryIntensityMonthly}
                title={`${t('energy-intensity-surface-ytd')} — ${filters.year}`}
              />
            </MainCard>
          </Grid>

          {/* ── Row 3 : Refrigerant reloaded by quarter (left) + Refrigerant breakdown pie (right) ── */}
          <Grid item xs={12} md={6}>
            <MainCard>
              <RefrigerantByQuarterChart
                data={refrigerantByQuarter}
                title={`${t('energy-refrigerant-by-country')} (${filters.year} T1 – T4)`}
              />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MainCard>
              <RefrigerantBreakdownChart
                data={refrigerantBreakdown}
                title={`${t('energy-refrigerant-breakdown')} (${filters.year} T1 – T4)`}
              />
            </MainCard>
          </Grid>

          {/* ── Row 4 : Top 10 (left) + Flop 10 (right) ── */}
          <Grid item xs={12} md={6}>
            <MainCard>
              <HorizontalRankingChart sites={topSites} title={t('energy-top-sites')} color="success" />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MainCard>
              <HorizontalRankingChart sites={flopSites} title={t('energy-flop-sites')} color="error" />
            </MainCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
