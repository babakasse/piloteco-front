import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import MainCard from 'components/MainCard';
import { useEnergyEfficiencyKpis } from 'hooks/useEnergyEfficiencyKpis';
import { EnergyFiltersType } from 'types/energy';

import DashboardFilters from 'sections/energy/DashboardFilters';
import CountryChips from 'sections/energy/CountryChips';
import KpiSummaryPanel from 'sections/energy/KpiSummaryPanel';
import EnergyIntensityYtdChart from 'sections/energy/EnergyIntensityYtdChart';
import ConsumptionSummaryRow from 'sections/energy/ConsumptionSummaryRow';

// ==============================|| PAGE — ENERGY EFFICIENCY ||============================== //

const DEFAULT_YEAR = 2025;
const DEFAULT_MONTH = '2025-12';

export default function EnergyEfficiency() {
  const [filters, setFilters] = useState<EnergyFiltersType>({
    resourceCategory: 'ELEC',
    month: DEFAULT_MONTH,
    year: DEFAULT_YEAR
  });

  function handleCountryChipsChange(codes: string[]) {
    setFilters((prev) => ({ ...prev, countryCodes: codes.length > 0 ? codes : undefined }));
  }

  function handleSiteTypeChange(event: SelectChangeEvent<string>) {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, siteTypes: value ? [value] : undefined }));
  }

  function handleSiteFormatChange(event: SelectChangeEvent<string>) {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, siteFormats: value ? [value] : undefined }));
  }

  const {
    efficiencySummary,
    kpiSummary,
    salesYtd,
    salesMtd,
    totalYtd,
    totalMtd,
    filterOptions,
    loading,
    error
  } = useEnergyEfficiencyKpis(filters);

  const selectedCountries = filters.countryCodes ?? [];
  const selectedSiteType = filters.siteTypes?.[0] ?? '';
  const selectedSiteFormat = filters.siteFormats?.[0] ?? '';

  return (
    <Box>
      {/* Top filters bar */}
      <MainCard sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <DashboardFilters filters={filters} onChange={setFilters} />
          <Divider />
          <CountryChips selected={selectedCountries} onChange={handleCountryChipsChange} />
          <Divider />
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Type de site</InputLabel>
              <Select value={selectedSiteType} label="Type de site" onChange={handleSiteTypeChange}>
                <MenuItem value=""><em>Tous</em></MenuItem>
                {(filterOptions.siteTypes ?? []).map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {(filterOptions.siteFormats ?? []).length > 0 && (
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Format</InputLabel>
                <Select value={selectedSiteFormat} label="Format" onChange={handleSiteFormatChange}>
                  <MenuItem value=""><em>Tous</em></MenuItem>
                  {filterOptions.siteFormats.map((f) => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Stack>
      </MainCard>

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
        <Stack spacing={2}>
          {/* ── Consommations ── */}
          <MainCard>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Consommations — {filters.year}
            </Typography>
            <Stack spacing={2}>
              <ConsumptionSummaryRow
                label="Tous types de sites"
                data={efficiencySummary?.ytd.all ?? null}
                variant="default"
              />
              <Divider />
              <ConsumptionSummaryRow
                label="Magasins (MAG)"
                data={efficiencySummary?.ytd.mag ?? null}
                variant="mag"
              />
            </Stack>
          </MainCard>

          {/* ── KPIs ── */}
          <MainCard>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Indicateurs clés — {filters.year}
            </Typography>
            <KpiSummaryPanel summary={kpiSummary} />
          </MainCard>

          {/* ── 4 intensity charts ── */}
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <MainCard sx={{ height: '100%', width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Intensité / surface commerciale — YTD (kWh/m²)
                </Typography>
                <EnergyIntensityYtdChart data={salesYtd} year={filters.year} />
              </MainCard>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <MainCard sx={{ height: '100%', width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Intensité / surface commerciale — MTD (kWh/m²)
                </Typography>
                <EnergyIntensityYtdChart data={salesMtd} year={filters.year} />
              </MainCard>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <MainCard sx={{ height: '100%', width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Intensité / surface bâtiment — YTD (kWh/m²)
                </Typography>
                <EnergyIntensityYtdChart data={totalYtd} year={filters.year} />
              </MainCard>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <MainCard sx={{ height: '100%', width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Intensité / surface bâtiment — MTD (kWh/m²)
                </Typography>
                <EnergyIntensityYtdChart data={totalMtd} year={filters.year} />
              </MainCard>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Box>
  );
}
