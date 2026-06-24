import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { SiteRankingItemType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — HORIZONTAL RANKING CHART ||============================== //

interface HorizontalRankingChartProps {
  sites: SiteRankingItemType[];
  title: string;
  color?: 'success' | 'error';
}

export default function HorizontalRankingChart({ sites, title, color = 'success' }: HorizontalRankingChartProps) {
  const theme = useTheme();
  const { t } = useLanguage();
  const barColor = color === 'success' ? theme.palette.success.main : theme.palette.error.main;

  const chartData = sites.map((s) => ({
    name: s.siteUniqueCode,
    value: +s.intensity.toFixed(2),
    country: s.countryCode
  }));

  if (sites.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" height={200}>
          <Typography color="text.secondary" variant="body2">
            {t('energy-no-data')}
          </Typography>
        </Box>
      </Box>
    );
  }

  const chartHeight = Math.max(180, sites.length * 28);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
          <XAxis
            type="number"
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => `${v}`}
            label={{ value: 'kWh/m²', position: 'insideBottomRight', offset: -4, style: { fontSize: 10 } }}
          />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
          <Tooltip formatter={(v: number) => [`${v} kWh/m²`, 'Intensity']} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
