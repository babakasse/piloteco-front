import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { TrendingDownOutlined, TrendingUpOutlined, RemoveOutlined } from '@mui/icons-material';

import { KpiSummaryType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — KPI SUMMARY PANEL ||============================== //

interface KpiSummaryPanelProps {
  summary: KpiSummaryType | null;
}

interface MetricRowProps {
  label: string;
  value: string | number;
  unit: string;
  evolutionPercent?: number;
}

function EvolutionChip({ percent }: { percent?: number }) {
  if (percent === undefined || percent === null) return null;
  const isDown = percent < 0;
  const isStable = percent === 0;
  return (
    <Chip
      size="small"
      icon={isStable ? <RemoveOutlined /> : isDown ? <TrendingDownOutlined /> : <TrendingUpOutlined />}
      label={`${percent > 0 ? '+' : ''}${percent.toFixed(1)} %`}
      color={isDown ? 'success' : isStable ? 'default' : 'error'}
      variant="outlined"
      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
    />
  );
}

function MetricRow({ label, value, unit, evolutionPercent }: MetricRowProps) {
  return (
    <Box sx={{ py: 1.25 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.75}>
        <Typography variant="h5" fontWeight={700} lineHeight={1}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {unit}
        </Typography>
        <EvolutionChip percent={evolutionPercent} />
      </Stack>
    </Box>
  );
}

export default function KpiSummaryPanel({ summary }: KpiSummaryPanelProps) {
  const { t } = useLanguage();

  const noData = '--';

  return (
    <Stack divider={<Divider flexItem />} spacing={0}>
      <MetricRow
        label={t('energy-total-consumption-mtd')}
        value={summary?.totalConsumptionMtd !== undefined ? Math.round(summary.totalConsumptionMtd / 1000) : noData}
        unit="MWh"
        evolutionPercent={summary?.evolutionMtdVsN1Percent}
      />

      <MetricRow
        label={t('energy-total-consumption-ytd')}
        value={summary?.totalConsumptionYtd !== undefined ? Math.round(summary.totalConsumptionYtd / 1000) : noData}
        unit="MWh"
        evolutionPercent={summary?.evolutionYtdVsN1Percent}
      />

      <MetricRow
        label={t('energy-intensity-mtd')}
        value={summary?.energyIntensityMtd !== undefined ? summary.energyIntensityMtd.toFixed(2) : noData}
        unit="kWh/m²"
        evolutionPercent={summary?.evolutionMtdVsN1Percent}
      />

      <MetricRow
        label={t('energy-intensity-ytd')}
        value={summary?.energyIntensityYtd !== undefined ? summary.energyIntensityYtd.toFixed(2) : noData}
        unit="kWh/m²"
        evolutionPercent={summary?.evolutionYtdVsN1Percent}
      />

      <MetricRow
        label={t('energy-refrigerant-ytd')}
        value={summary?.refrigerantTotalYtdKg !== undefined ? summary.refrigerantTotalYtdKg.toFixed(1) : noData}
        unit="kg"
      />
    </Stack>
  );
}
