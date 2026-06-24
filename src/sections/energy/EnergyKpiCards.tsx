import Grid from '@mui/material/Grid';
import { BoltOutlined, WaterDropOutlined, LocalFireDepartmentOutlined, TrendingDownOutlined } from '@mui/icons-material';

import MetricsCard from 'components/cards/statistics/MetricsCard';
import { KpiSummaryType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — KPI CARDS ||============================== //

interface EnergyKpiCardsProps {
  summary: KpiSummaryType | null;
}

function formatEvolution(value?: number): { trend: 'up' | 'down' | 'stable'; label: string } | undefined {
  if (value === undefined || value === null) return undefined;
  if (value > 0) return { trend: 'up', label: `+${value.toFixed(1)} % vs N-1` };
  if (value < 0) return { trend: 'down', label: `${value.toFixed(1)} % vs N-1` };
  return { trend: 'stable', label: '0 % vs N-1' };
}

export default function EnergyKpiCards({ summary }: EnergyKpiCardsProps) {
  const { t } = useLanguage();

  const intensityEvolution = formatEvolution(summary?.evolutionMtdVsN1Percent);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricsCard
          title={t('energy-total-consumption-mtd')}
          value={summary?.totalConsumptionMtd !== undefined ? Math.round(summary.totalConsumptionMtd / 1000) : '--'}
          unit="MWh"
          color="primary"
          icon={<BoltOutlined />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricsCard
          title={t('energy-intensity-mtd')}
          value={summary?.energyIntensityMtd !== undefined ? summary.energyIntensityMtd.toFixed(2) : '--'}
          unit="kWh/m²"
          color="info"
          icon={<WaterDropOutlined />}
          trend={intensityEvolution?.trend}
          trendValue={intensityEvolution?.label}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricsCard
          title={t('energy-total-consumption-ytd')}
          value={summary?.totalConsumptionYtd !== undefined ? Math.round(summary.totalConsumptionYtd / 1000) : '--'}
          unit="MWh"
          color="success"
          icon={<LocalFireDepartmentOutlined />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricsCard
          title={t('energy-refrigerant-ytd')}
          value={summary?.refrigerantTotalYtdKg !== undefined ? summary.refrigerantTotalYtdKg.toFixed(1) : '--'}
          unit="kg"
          color="warning"
          icon={<TrendingDownOutlined />}
        />
      </Grid>
    </Grid>
  );
}
