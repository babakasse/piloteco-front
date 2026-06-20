import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import MainCard from 'components/MainCard';
import { useEnergyKpis } from 'hooks/useEnergyKpis';
import { useLanguage } from 'contexts/LanguageContext';
import { EnergyFiltersType } from 'types/energy';

import DashboardFilters from 'sections/energy/DashboardFilters';
import EnergyKpiCards from 'sections/energy/EnergyKpiCards';
import MonthlyEvolutionChart from 'sections/energy/MonthlyEvolutionChart';
import SiteRankingTable from 'sections/energy/SiteRankingTable';

// ==============================|| PAGE — ENERGY DASHBOARD ||============================== //

// Default to current year, january — user can change freely
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

  const { summary, monthlyEvolution, topSites, flopSites, loading, error } = useEnergyKpis(filters);

  return (
    <Box>
      {/* Filters bar */}
      <MainCard sx={{ mb: 3 }}>
        <DashboardFilters filters={filters} onChange={setFilters} />
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
        <Grid container spacing={3}>
          {/* KPI Cards */}
          <Grid item xs={12}>
            <EnergyKpiCards summary={summary} />
          </Grid>

          {/* Monthly evolution chart */}
          <Grid item xs={12} md={8}>
            <MainCard title={t('energy-monthly-evolution')}>
              <MonthlyEvolutionChart data={monthlyEvolution} />
            </MainCard>
          </Grid>

          {/* Top / Flop ranking */}
          <Grid item xs={12} md={4}>
            <MainCard title={t('energy-site-ranking')}>
              <SiteRankingTable sites={topSites} title={t('energy-top-sites')} highlightColor="success" />
              {topSites.length > 0 && flopSites.length > 0 && <Divider sx={{ my: 2 }} />}
              <SiteRankingTable sites={flopSites} title={t('energy-flop-sites')} highlightColor="error" />
            </MainCard>
          </Grid>

          {/* Summary detail */}
          {summary?.totalConsumptionMtd !== undefined && (
            <Grid item xs={12}>
              <MainCard title={t('energy-summary-detail')}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      {t('energy-intensity-ytd')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {summary.energyIntensityYtd !== undefined ? `${summary.energyIntensityYtd.toFixed(2)} kWh/m²` : '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      {t('energy-evolution-ytd')}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={
                        summary.evolutionYtdVsN1Percent !== undefined
                          ? summary.evolutionYtdVsN1Percent < 0
                            ? 'success.main'
                            : 'error.main'
                          : 'text.primary'
                      }
                    >
                      {summary.evolutionYtdVsN1Percent !== undefined
                        ? `${summary.evolutionYtdVsN1Percent > 0 ? '+' : ''}${summary.evolutionYtdVsN1Percent.toFixed(1)} %`
                        : '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      {t('energy-evolution-mtd')}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={
                        summary.evolutionMtdVsN1Percent !== undefined
                          ? summary.evolutionMtdVsN1Percent < 0
                            ? 'success.main'
                            : 'error.main'
                          : 'text.primary'
                      }
                    >
                      {summary.evolutionMtdVsN1Percent !== undefined
                        ? `${summary.evolutionMtdVsN1Percent > 0 ? '+' : ''}${summary.evolutionMtdVsN1Percent.toFixed(1)} %`
                        : '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      {t('energy-total-consumption-mtd')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {Math.round((summary.totalConsumptionMtd ?? 0) / 1000).toLocaleString()} MWh
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
