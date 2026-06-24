import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { RefrigerantByQuarterItemType } from 'types/energy';

// ==============================|| ENERGY — REFRIGERANT BY QUARTER CHART ||============================== //

interface RefrigerantByQuarterChartProps {
  data: RefrigerantByQuarterItemType[];
  title: string;
}

const COUNTRY_COLORS = [
  '#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0',
  '#00BCD4', '#FF5722', '#607D8B', '#795548', '#FFC107'
];

export default function RefrigerantByQuarterChart({ data, title }: RefrigerantByQuarterChartProps) {
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

  // Collect all countries and all quarters
  const countriesSet = new Set<string>();
  const quartersMap = new Map<string, { quarter: string; quarterStart: string; quarterEnd: string }>();

  for (const item of data) {
    countriesSet.add(item.countryCode);
    if (!quartersMap.has(item.quarter)) {
      quartersMap.set(item.quarter, {
        quarter: item.quarter,
        quarterStart: item.quarterStart,
        quarterEnd: item.quarterEnd
      });
    }
  }

  const countries = Array.from(countriesSet).sort();
  const quarters = Array.from(quartersMap.keys()).sort();

  // Build chart data: one entry per quarter with all country values
  const chartData = quarters.map((quarter) => {
    const entry: Record<string, string | number> = { quarter };
    const qItems = data.filter((d) => d.quarter === quarter);
    for (const country of countries) {
      const item = qItems.find((d) => d.countryCode === country);
      entry[country] = item?.totalKg ?? 0;
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
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Tooltip formatter={(v: number) => [`${v} kg`, '']} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {countries.map((country, idx) => (
            <Bar
              key={country}
              dataKey={country}
              fill={COUNTRY_COLORS[idx % COUNTRY_COLORS.length]}
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
