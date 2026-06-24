import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { CountryIntensityMonthlyItemType } from 'types/energy';

// ==============================|| ENERGY — COUNTRY INTENSITY MONTHLY CHART (YTD) ||============================== //

interface CountryIntensityMonthlyChartProps {
  data: CountryIntensityMonthlyItemType[];
  title: string;
}

const COUNTRY_COLORS = [
  '#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0',
  '#00BCD4', '#FF5722', '#607D8B', '#795548', '#FFC107',
  '#8BC34A', '#03A9F4', '#F44336', '#673AB7', '#009688'
];

export default function CountryIntensityMonthlyChart({ data, title }: CountryIntensityMonthlyChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" height={260}>
          <Typography color="text.secondary" variant="body2">
            No data
          </Typography>
        </Box>
      </Box>
    );
  }

  // Collect all countries and all months
  const countriesSet = new Set<string>();
  const monthsSet = new Set<string>();

  for (const item of data) {
    countriesSet.add(item.countryCode);
    monthsSet.add(item.month);
  }

  const countries = Array.from(countriesSet).sort();
  const months = Array.from(monthsSet).sort();

  // Build chart data: one entry per month with intensity per country
  const chartData = months.map((month) => {
    const entry: Record<string, string | number | null> = { month: month.slice(5) }; // display MM
    const monthItems = data.filter((d) => d.month === month);
    for (const country of countries) {
      const item = monthItems.find((d) => d.countryCode === country);
      entry[country] = item ? +((item.intensity ?? 0) as number).toFixed(2) : null;
    }
    return entry;
  });

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            label={{ value: 'kWh/m²', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
            width={52}
          />
          <Tooltip formatter={(v: number) => [`${v} kWh/m²`, '']} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {countries.map((country, idx) => (
            <Bar
              key={country}
              dataKey={country}
              fill={COUNTRY_COLORS[idx % COUNTRY_COLORS.length]}
              radius={[2, 2, 0, 0]}
              maxBarSize={18}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
