import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useLanguage } from 'contexts/LanguageContext';
import { TranslationKeys } from 'locales';

interface Assessment {
  id: string;
  year: number;
  name: string;
  scope1Emissions?: number;
  scope2Emissions?: number;
  scope3Emissions?: number;
  totalEmissions?: number;
}

interface EmissionsTrendChartProps {
  assessments: Assessment[];
}

const SERIES: { key: string; labelKey: TranslationKeys; color: string }[] = [
  { key: 'scope1', labelKey: 'scope-1', color: '#10b981' },
  { key: 'scope2', labelKey: 'scope-2', color: '#3b82f6' },
  { key: 'scope3', labelKey: 'scope-3', color: '#f59e0b' },
  { key: 'total', labelKey: 'total-emissions', color: '#ef4444' }
];

const EmissionsTrendChart = ({ assessments }: EmissionsTrendChartProps) => {
  const { t } = useLanguage();
  const data = assessments
    .filter((a) => a.totalEmissions !== undefined && a.year != null)
    .sort((a, b) => a.year - b.year)
    .map((a) => ({
      year: a.year.toString(),
      scope1: a.scope1Emissions || 0,
      scope2: a.scope2Emissions || 0,
      scope3: a.scope3Emissions || 0,
      total: a.totalEmissions || 0
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
            {t('year')} {label}
          </Typography>
          {payload.map((entry: any, i: number) => (
            <Box key={i} display="flex" justifyContent="space-between" gap={2}>
              <Typography variant="caption" sx={{ color: entry.color }}>
                {entry.name}
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {entry.value.toLocaleString()} tCO₂e
              </Typography>
            </Box>
          ))}
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
            {t('emissions-evolution')}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
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
          {t('emissions-evolution')}
        </Typography>
        <Box height={360}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toLocaleString()}`}
                label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={t(s.labelKey)}
                  stroke={s.color}
                  strokeWidth={s.key === 'total' ? 2.5 : 2}
                  strokeDasharray={s.key === 'total' ? '6 3' : undefined}
                  fill={`url(#grad-${s.key})`}
                  dot={{ fill: s.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmissionsTrendChart;
