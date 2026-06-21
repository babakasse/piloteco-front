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
import RefrigerantByCountryChart from 'sections/energy/RefrigerantByCountryChart';

// ==============================|| PAGE — ENERGY DASHBOARD ||============================== //

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = `${CURRENT_YEAR}-01`;
const DEFAULT_YEAR = CURRENT_YEAR;

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

  const { summary, monthlyEvolution, topSites, flopSites, countryIntensity, refrigerantByCountry, loading, error } = useEnergyKpis(filters);

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
          {/* ── Row 1 : KPI panel (left) + Intensity chart (right) ── */}
          <Grid item xs={12} md={4}>
            <MainCard sx={{ height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t('energy-kpi-summary')}
              </Typography>
              <KpiSummaryPanel summary={summary} />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={8}>
            <MainCard sx={{ height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t('energy-monthly-evolution')} — {filters.year}
              </Typography>
              <EnergyIntensityYtdChart data={monthlyEvolution} year={filters.year} />
            </MainCard>
          </Grid>

          {/* ── Row 2 : Intensity by country (left) + Refrigerant by country (right) ── */}
          <Grid item xs={12} md={6}>
            <MainCard>
              <CountryIntensityChart
                data={countryIntensity}
                title={t('energy-intensity-by-country')}
              />
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MainCard>
              <RefrigerantByCountryChart
                data={refrigerantByCountry}
                title={t('energy-refrigerant-by-country')}
              />
            </MainCard>
          </Grid>

          {/* ── Row 3 : Top 10 (left) + Flop 10 (right) ── */}
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
