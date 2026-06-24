import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { KpiSummaryType } from 'types/energy';

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

function fmt(value?: number, decimals = 0): string {
  if (value === undefined || value === null) return '--';
  return value.toLocaleString('fr-FR', { maximumFractionDigits: decimals });
}

function fmtGwh(kwh?: number): string {
  if (kwh === undefined || kwh === null) return '--';
  return (kwh / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

export default function KpiSummaryPanel({ summary }: KpiSummaryPanelProps) {
  return (
    <Grid container spacing={1.5}>
      {/* Row 1: Sales Surface + Commercial Energy Intensity */}
      <Grid item xs={6}>
        <KpiCard
          label="Sales Surface"
          value={fmt(summary?.salesSurfaceM2)}
          unit="m²"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label="Commercial Energy Intensity"
          value={fmt(summary?.commercialEnergyIntensityYtd, 2)}
          unit="kWh/m²"
        />
      </Grid>

      {/* Row 2: Total Surface + Building Energy Intensity */}
      <Grid item xs={6}>
        <KpiCard
          label="Total Surface"
          value={fmt(summary?.totalSurfaceM2)}
          unit="m²"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label="Building Energy Intensity"
          value={fmt(summary?.buildingEnergyIntensityYtd, 2)}
          unit="kWh/m²"
        />
      </Grid>

      {/* Row 3: Green Electricity Consumption + % */}
      <Grid item xs={6}>
        <KpiCard
          label="Green Electricity Consumption"
          value={fmtGwh(summary?.greenElectricityConsumptionKwh)}
          unit="GWh"
          color="green"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label="% Green Electricity Consumption"
          value={fmt(summary?.greenElectricityConsumptionPercent, 0)}
          unit="%"
          color="green"
        />
      </Grid>

      {/* Row 4: Green Electricity Production + % */}
      <Grid item xs={6}>
        <KpiCard
          label="Green Electricity Production"
          value={fmtGwh(summary?.greenElectricityProductionKwh)}
          unit="GWh"
          color="green"
        />
      </Grid>
      <Grid item xs={6}>
        <KpiCard
          label="% Green Electricity Production"
          value={fmt(summary?.greenElectricityProductionPercent, 0)}
          unit="%"
          color="green"
        />
      </Grid>
    </Grid>
  );
}
