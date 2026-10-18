import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { KpiSummaryType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — KPI SUMMARY PANEL ||============================== //

interface KpiSummaryPanelProps {
  summary: KpiSummaryType | null;
}

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  color?: 'default' | 'green';
}

function KpiCard({ label, value, unit, color = 'default' }: KpiCardProps) {
  const theme = useTheme();

  const isGreen = color === 'green';

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: isGreen
          ? `${theme.palette.success.main}18`
          : theme.palette.mode === 'dark'
          ? 'background.paper'
          : 'grey.50',
        border: `1px solid ${isGreen ? theme.palette.success.light : theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography
        variant="caption"
        color={isGreen ? 'success.dark' : 'text.secondary'}
        sx={{ display: 'block', mb: 0.5, lineHeight: 1.3, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="baseline" gap={0.5} flexWrap="wrap">
        <Typography
          variant="h6"
          fontWeight={700}
          lineHeight={1.1}
          color={isGreen ? 'success.dark' : 'text.primary'}
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography variant="caption" color={isGreen ? 'success.main' : 'text.secondary'} fontWeight={600}>
            {unit}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function fmt(value: number | undefined, locale: string, decimals = 0): string {
  if (value === undefined || value === null) return '--';
  return value.toLocaleString(locale, { maximumFractionDigits: decimals });
}

function fmtGwh(kwh: number | undefined, locale: string): string {
  if (kwh === undefined || kwh === null) return '--';
  return (kwh / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 2 });
}

export default function KpiSummaryPanel({ summary }: KpiSummaryPanelProps) {
  const { t, language } = useLanguage();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <Grid container spacing={1.5}>
      {/* Row 1: Sales Surface (MAG only) + Commercial Energy Intensity */}
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-sales-surface-mag')}
          value={fmt(summary?.salesSurfaceM2, locale)}
          unit="m²"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-commercial-intensity-ytd')}
          value={fmt(summary?.commercialEnergyIntensityYtd, locale, 2)}
          unit="kWh/m²"
        />
      </Grid>

      {/* Row 2: Total Surface (all types) + Building Energy Intensity */}
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-total-building-surface')}
          value={fmt(summary?.totalSurfaceM2, locale)}
          unit="m²"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-building-intensity-ytd')}
          value={fmt(summary?.buildingEnergyIntensityYtd, locale, 2)}
          unit="kWh/m²"
        />
      </Grid>

      {/* Rows 3-4: Green metrics — always shown, -- when not ELEC */}
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-green-electricity-consumption')}
          value={fmtGwh(summary?.greenElectricityConsumptionKwh, locale)}
          unit="GWh"
          color="green"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-green-electricity-consumption-percent')}
          value={fmt(summary?.greenElectricityConsumptionPercent, locale, 0)}
          unit="%"
          color="green"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-green-electricity-production')}
          value={fmtGwh(summary?.greenElectricityProductionKwh, locale)}
          unit="GWh"
          color="green"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label={t('energy-green-electricity-production-percent')}
          value={fmt(summary?.greenElectricityProductionPercent, locale, 0)}
          unit="%"
          color="green"
        />
      </Grid>
    </Grid>
  );
}
