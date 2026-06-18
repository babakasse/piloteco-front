import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useLanguage } from 'contexts/LanguageContext';
import { translateCategory } from '../../utils/translationUtils';

interface Emission {
  id: string;
  category: string;
  scope: number;
  amount?: number;
  quantity?: number;
  unit: string;
}

interface EmissionsByCategoryChartProps {
  emissions: Emission[];
}

const SCOPE_COLORS: Record<number, string> = {
  1: '#10b981',
  2: '#3b82f6',
  3: '#f59e0b'
};

const EmissionsByCategoryChart = ({ emissions }: EmissionsByCategoryChartProps) => {
  const { t } = useLanguage();

  const categoryData = emissions.reduce((acc: any, emission) => {
    const originalCategory = emission.category || t('not-specified');
    const translatedCategory = translateCategory(originalCategory, t);
    const amount = emission.amount || emission.quantity || 0;
    const key = `${translatedCategory}__${emission.scope}`;

    if (!acc[key]) {
      acc[key] = { category: translatedCategory, scope: emission.scope, total: 0 };
    }
    acc[key].total += amount;
    return acc;
  }, {});

  // Grouped by category, summed total, sorted desc
  const grouped: Record<string, { category: string; scope1: number; scope2: number; scope3: number; total: number }> = {};
  Object.values(categoryData).forEach((item: any) => {
    if (!grouped[item.category]) {
      grouped[item.category] = { category: item.category, scope1: 0, scope2: 0, scope3: 0, total: 0 };
    }
    grouped[item.category][`scope${item.scope}` as 'scope1' | 'scope2' | 'scope3'] += item.total;
    grouped[item.category].total += item.total;
  });

  const data = Object.values(grouped)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8); // max 8 catégories pour la lisibilité

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find((d) => d.category === label);
      return (
        <Box
          sx={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: 160
          }}
        >
          <Typography variant="body2" fontWeight={700} mb={0.5}>
            {label}
          </Typography>
          {[1, 2, 3].map((scope) => {
            const val = item ? item[`scope${scope}` as 'scope1' | 'scope2' | 'scope3'] : 0;
            if (!val) return null;
            return (
              <Box key={scope} display="flex" justifyContent="space-between" gap={2}>
                <Typography variant="caption" sx={{ color: SCOPE_COLORS[scope] }}>
                  Scope {scope}
                </Typography>
                <Typography variant="caption" fontWeight={700}>
                  {val.toLocaleString()} tCO₂e
                </Typography>
              </Box>
            );
          })}
          <Box mt={0.5} pt={0.5} borderTop="1px solid rgba(0,0,0,0.06)" display="flex" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography variant="caption" fontWeight={800}>{item?.total.toLocaleString()} tCO₂e</Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t('emissions-by-category')}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={340}>
            <Typography color="text.secondary">{t('no-emissions-data')}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {t('emissions-by-category')}
        </Typography>
        <Box height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              barCategoryGap="30%"
            >
              <defs>
                {data.map((item, i) => {
                  // dominant scope color
                  const maxScope = [1, 2, 3].reduce((best, s) =>
                    item[`scope${s}` as 'scope1' | 'scope2' | 'scope3'] > item[`scope${best}` as 'scope1' | 'scope2' | 'scope3'] ? s : best,
                    1
                  );
                  const color = SCOPE_COLORS[maxScope];
                  return (
                    <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.55} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={`url(#bar-grad-${i})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Légende scope */}
        <Box display="flex" justifyContent="center" gap={3} mt={1} flexWrap="wrap">
          {[1, 2, 3].map((s) => (
            <Box key={s} display="flex" alignItems="center" gap={0.8}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, background: SCOPE_COLORS[s] }} />
              <Typography variant="caption" color="text.secondary">
                Scope {s}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmissionsByCategoryChart;
