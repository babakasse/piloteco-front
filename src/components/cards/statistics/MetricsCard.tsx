// src/components/cards/statistics/MetricsCard.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

const MetricsCard = ({ title, value, unit = '', trend, trendValue, color = 'primary', icon }: MetricsCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <span style={{ color: '#d32f2f', fontSize: 16 }}>↗</span>;
      case 'down':
        return <span style={{ color: '#2e7d32', fontSize: 16 }}>↘</span>;
      case 'stable':
        return <span style={{ color: '#1976d2', fontSize: 16 }}>→</span>;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'error';
      case 'down':
        return 'success';
      case 'stable':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: `${color}.main` }}>{icon}</Box>}
        </Box>

        <Typography variant="h4" component="div" sx={{ color: `${color}.main`, mb: 1 }}>
          {value}{' '}
          {unit && (
            <Typography component="span" variant="body1">
              {unit}
            </Typography>
          )}
        </Typography>

        {trend && trendValue && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {getTrendIcon()}
            <Chip label={trendValue} size="small" color={getTrendColor()} variant="outlined" />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
