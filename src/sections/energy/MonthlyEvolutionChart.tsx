import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { MonthlyEvolutionItemType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — MONTHLY EVOLUTION CHART ||============================== //

interface MonthlyEvolutionChartProps {
  data: MonthlyEvolutionItemType[];
}

function formatMonth(month: string): string {
  const [, m] = month.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months[parseInt(m, 10) - 1] ?? month;
}

export default function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    [t('energy-current-year')]: item.current !== undefined ? Math.round(item.current / 1000) : null,
    [t('energy-previous-year')]: item.previous !== undefined ? Math.round(item.previous / 1000) : null
  }));

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {t('energy-monthly-evolution-unit')}
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              borderRadius: 8,
              fontSize: 13
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey={t('energy-current-year')} fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Line
            type="monotone"
            dataKey={t('energy-previous-year')}
            stroke={theme.palette.warning.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
