import { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useLanguage } from 'contexts/LanguageContext';

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  icon?: ReactNode;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  primary:   { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', text: '#6366f1' },
  secondary: { bg: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)', text: '#64748b' },
  success:   { bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', text: '#10b981' },
  warning:   { bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', text: '#f59e0b' },
  error:     { bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', text: '#ef4444' },
  info:      { bg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', text: '#3b82f6' }
};

const TREND_CONFIG = {
  up:     { arrow: '↗', color: '#ef4444' },
  down:   { arrow: '↘', color: '#10b981' },
  stable: { arrow: '→', color: '#3b82f6' }
};

const MetricsCard = ({ title, value, unit = '', trend, trendValue, color = 'primary', icon }: MetricsCardProps) => {
  const { t } = useLanguage();
  const palette = COLOR_MAP[color] || COLOR_MAP.primary;
  const trendCfg = trend ? TREND_CONFIG[trend] : null;
  const numVal = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 24,
          right: 24,
          height: 3,
          borderRadius: '0 0 4px 4px',
          background: palette.bg
        }}
      />
      <CardContent sx={{ pt: 2.5, pb: '16px !important' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline" gap={0.5} mt={0.5}>
              <Typography variant="h4" fontWeight={800} lineHeight={1.1} sx={{ color: palette.text }}>
                {numVal}
              </Typography>
              {unit && (
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>

          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: palette.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                '& svg': { fontSize: 22 }
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {trendCfg && trendValue && (
          <Box display="flex" alignItems="center" gap={0.5} mt={1.5}>
            <Typography variant="caption" sx={{ color: trendCfg.color, fontWeight: 700, fontSize: 13 }}>
              {trendCfg.arrow}
            </Typography>
            <Typography variant="caption" sx={{ color: trendCfg.color, fontWeight: 600 }}>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
