import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { MonthlyEvolutionItemType } from 'types/energy';

// ==============================|| ENERGY — INTENSITY YTD CHART ||============================== //

interface EnergyIntensityYtdChartProps {
  data: MonthlyEvolutionItemType[];
  year: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EnergyIntensityYtdChart({ data, year }: EnergyIntensityYtdChartProps) {
  const theme = useTheme();

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        month: MONTH_LABELS[parseInt(item.month.split('-')[1] ?? '1', 10) - 1] ?? item.month,
        current: item.current !== undefined ? +item.current.toFixed(2) : undefined,
        previous: item.previous !== undefined ? +item.previous.toFixed(2) : undefined,
        evolution: item.evolutionPercent !== undefined ? +item.evolutionPercent.toFixed(1) : undefined
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={280}>
        <Typography color="text.secondary" variant="body2">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          yAxisId="left"
          tickFormatter={(v) => `${v}`}
          tick={{ fontSize: 11 }}
          label={{ value: 'kWh/m²', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11 }}
          domain={['auto', 'auto']}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === 'Gap % vs N-1') return [`${value}%`, name];
            return [`${value} kWh/m²`, name];
          }}
        />
        <Legend />
        <ReferenceLine yAxisId="right" y={0} stroke={theme.palette.divider} strokeWidth={2} />
        <Bar yAxisId="left" dataKey="current" name={String(year)} fill={theme.palette.primary.main} radius={[3, 3, 0, 0]} maxBarSize={32} />
        <Bar
          yAxisId="left"
          dataKey="previous"
          name={String(year - 1)}
          fill={theme.palette.primary.light}
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
          opacity={0.6}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="evolution"
          name="Gap % vs N-1"
          stroke={theme.palette.warning.main}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
