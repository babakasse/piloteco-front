import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

import { EfficiencyConsumptionBucketType } from 'types/energy';

// ==============================|| ENERGY — CONSUMPTION SUMMARY ROW ||============================== //

interface ConsumptionSummaryRowProps {
  label: string;
  data: EfficiencyConsumptionBucketType | null;
  variant?: 'default' | 'mag';
}

function fmtGwh(kwh: number | null): string {
  if (kwh === null || kwh === undefined) return '--';
  return (kwh / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' GWh';
}

function fmtM3(val: number | null): string {
  if (val === null || val === undefined) return '--';
  return val.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' m³';
}

interface MetricCellProps {
  label: string;
  value: string;
  color: string;
  bg: string;
}

function MetricCell({ label, value, color, bg }: MetricCellProps) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: bg,
        border: `1px solid ${color}30`,
        minWidth: 140
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700} color={color}>
        {value}
      </Typography>
    </Box>
  );
}

export default function ConsumptionSummaryRow({ label, data, variant = 'default' }: ConsumptionSummaryRowProps) {
  const theme = useTheme();

  const isMag = variant === 'mag';
  const headerColor = isMag ? theme.palette.warning.dark : theme.palette.primary.dark;
  const headerBg = isMag ? `${theme.palette.warning.main}15` : `${theme.palette.primary.main}10`;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Chip
          label={label}
          size="small"
          sx={{
            bgcolor: headerBg,
            color: headerColor,
            fontWeight: 700,
            fontSize: '0.75rem'
          }}
        />
      </Stack>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <MetricCell
          label="Électricité"
          value={fmtGwh(data?.elecKwh ?? null)}
          color={theme.palette.primary.main}
          bg={`${theme.palette.primary.main}08`}
        />
        <MetricCell
          label="Gaz Naturel (NG)"
          value={fmtGwh(data?.gasNgKwh ?? null)}
          color={theme.palette.warning.dark}
          bg={`${theme.palette.warning.main}08`}
        />
        <MetricCell
          label="Réseau de chaleur (HN)"
          value={fmtGwh(data?.gasHnKwh ?? null)}
          color={theme.palette.error.dark}
          bg={`${theme.palette.error.main}08`}
        />
        <MetricCell
          label="Eau (consommée)"
          value={fmtM3(data?.waterConsumedM3 ?? null)}
          color={theme.palette.info.dark}
          bg={`${theme.palette.info.main}08`}
        />
      </Stack>
    </Box>
  );
}
