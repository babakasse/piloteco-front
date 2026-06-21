import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useLanguage } from 'contexts/LanguageContext';

interface ScopeDistributionChartProps {
  scope1: number;
  scope2: number;
  scope3: number;
}

const PALETTE = [
  { base: '#10b981', light: '#d1fae5' },
  { base: '#3b82f6', light: '#dbeafe' },
  { base: '#f59e0b', light: '#fef3c7' }
];

const ScopeDistributionChart = ({ scope1, scope2, scope3 }: ScopeDistributionChartProps) => {
  const { t } = useLanguage();
  const rawData = [
    { name: t('scope-1'), value: scope1, ...PALETTE[0] },
    { name: t('scope-2'), value: scope2, ...PALETTE[1] },
    { name: t('scope-3'), value: scope3, ...PALETTE[2] }
  ].filter((item) => item.value > 0);

  const total = scope1 + scope2 + scope3;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <Box
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ color: item.payload.base }}>
            {item.payload.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.value.toLocaleString()} tCO₂e
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t('scope-distribution')}
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
          {t('scope-distribution')}
        </Typography>
        <Box position="relative" height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {rawData.map((p, i) => (
                  <radialGradient key={i} id={`grad-scope-${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.base} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={p.base} stopOpacity={0.7} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={rawData}
                cx="50%"
                cy="48%"
                innerRadius="52%"
                outerRadius="75%"
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {rawData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#grad-scope-${index})`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -58%)', textAlign: 'center', pointerEvents: 'none' }}
          >
            <Typography variant="h5" fontWeight={800} lineHeight={1}>
              {total.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              tCO₂e
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" gap={3} mt={1} flexWrap="wrap">
          {rawData.map((item, i) => (
            <Box key={i} display="flex" alignItems="center" gap={0.8}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: item.base,
                  flexShrink: 0
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.name}
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScopeDistributionChart;
