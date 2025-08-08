// src/components/charts/ScopeDistributionChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ScopeDistributionChartProps {
  scope1: number;
  scope2: number;
  scope3: number;
}

const COLORS = ['#2e7d32', '#1976d2', '#ed6c02']; // vert, bleu, orange

const ScopeDistributionChart = ({ scope1, scope2, scope3 }: ScopeDistributionChartProps) => {
  const data = [
    { name: 'Scope 1', value: scope1, color: COLORS[0] },
    { name: 'Scope 2', value: scope2, color: COLORS[1] },
    { name: 'Scope 3', value: scope3, color: COLORS[2] }
  ].filter((item) => item.value > 0); // Filtrer les valeurs nulles

  const total = scope1 + scope2 + scope3;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
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
            <strong>{data.name}</strong>
          </Typography>
          <Typography variant="body2">
            {data.value} kgCO₂e ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Répartition par Scope
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <Typography color="text.secondary">Aucune donnée d'émissions disponible</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Répartition par Scope
        </Typography>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScopeDistributionChart;
