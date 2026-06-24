import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { RefrigerantByCountryItemType } from 'types/energy';

// ==============================|| ENERGY — REFRIGERANT BY COUNTRY CHART ||============================== //

interface RefrigerantByCountryChartProps {
  data: RefrigerantByCountryItemType[];
  title: string;
}

export default function RefrigerantByCountryChart({ data, title }: RefrigerantByCountryChartProps) {
  const theme = useTheme();

  const quarterLabel =
    data.length > 0 ? `${data[0].quarterStart} → ${data[0].quarterEnd}` : '';

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

  const chartData = data.map((d) => ({
    country: d.countryCode,
    value: +d.totalKg.toFixed(1)
  }));

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        {quarterLabel && (
          <Chip label={`QTD ${quarterLabel}`} size="small" variant="outlined" color="default" />
        )}
      </Stack>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="country" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Tooltip formatter={(v: number) => [`${v} kg`, 'Refrigerant reloaded']} />
          <Bar dataKey="value" fill={theme.palette.info.main} radius={[3, 3, 0, 0]} maxBarSize={40}>
            <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} formatter={(v) => `${v}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
