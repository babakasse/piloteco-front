import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { CountryIntensityItemType } from 'types/energy';

// ==============================|| ENERGY — COUNTRY INTENSITY CHART ||============================== //

interface CountryIntensityChartProps {
  data: CountryIntensityItemType[];
  title: string;
}

export default function CountryIntensityChart({ data, title }: CountryIntensityChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" height={220}>
          <Typography color="text.secondary" variant="body2">
            No data
          </Typography>
        </Box>
      </Box>
    );
  }

  const chartData = data
    .filter((d) => d.intensity !== null)
    .map((d) => ({
      country: d.countryCode,
      value: +(d.intensity as number).toFixed(2)
    }));

  // Colour gradient: higher intensity = warmer colour (warning → error)
  const maxIntensity = Math.max(...chartData.map((d) => d.value), 1);

  function barColor(value: number): string {
    const ratio = value / maxIntensity;
    if (ratio > 0.75) return theme.palette.error.main;
    if (ratio > 0.4) return theme.palette.warning.main;
    return theme.palette.success.main;
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="country" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            label={{ value: 'kWh/m²', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Tooltip formatter={(v: number) => [`${v} kWh/m²`, 'Intensity']} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
            <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} formatter={(v) => `${v}`} />
            {chartData.map((entry, index) => (
              <Cell key={index} fill={barColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
