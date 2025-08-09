// src/components/charts/EmissionsByCategoryChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useLanguage } from 'contexts/LanguageContext';

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

const EmissionsByCategoryChart = ({ emissions }: EmissionsByCategoryChartProps) => {
  const { t } = useLanguage();
  // Grouper les émissions par catégorie et scope
  const categoryData = emissions.reduce((acc: any, emission) => {
    const category = emission.category || t('not-specified');
    const amount = emission.amount || emission.quantity || 0;

    if (!acc[category]) {
      acc[category] = {
        category,
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0
      };
    }

    acc[category][`scope${emission.scope}`] += amount;
    acc[category].total += amount;

    return acc;
  }, {});

  const data = Object.values(categoryData).sort((a: any, b: any) => b.total - a.total);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            p: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2">
            <strong>{label}</strong>
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value} kgCO₂e
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('emissions-by-category')}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <Typography color="text.secondary">{t('no-emissions-data')}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('emissions-by-category')}
        </Typography>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 80
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis label={{ value: 'kgCO₂e', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="scope1" stackId="a" fill="#2e7d32" name="Scope 1" />
              <Bar dataKey="scope2" stackId="a" fill="#1976d2" name="Scope 2" />
              <Bar dataKey="scope3" stackId="a" fill="#ed6c02" name="Scope 3" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmissionsByCategoryChart;
