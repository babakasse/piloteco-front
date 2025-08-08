// src/components/charts/EmissionsTrendChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

const EmissionsTrendChart = ({ assessments }: EmissionsTrendChartProps) => {
  // Trier les évaluations par année et préparer les données pour le graphique
  const data = assessments
    .filter((assessment) => assessment.totalEmissions !== undefined)
    .sort((a, b) => a.year - b.year)
    .map((assessment) => ({
      year: assessment.year.toString(),
      scope1: assessment.scope1Emissions || 0,
      scope2: assessment.scope2Emissions || 0,
      scope3: assessment.scope3Emissions || 0,
      total: assessment.totalEmissions || 0
    }));

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
            <strong>Année {label}</strong>
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
            Évolution des Émissions
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <Typography color="text.secondary">Aucune donnée d'évolution disponible</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Évolution des Émissions par Année
        </Typography>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'kgCO₂e', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="scope1"
                stroke="#2e7d32"
                strokeWidth={3}
                name="Scope 1"
                dot={{ fill: '#2e7d32', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="scope2"
                stroke="#1976d2"
                strokeWidth={3}
                name="Scope 2"
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="scope3"
                stroke="#ed6c02"
                strokeWidth={3}
                name="Scope 3"
                dot={{ fill: '#ed6c02', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#d32f2f"
                strokeWidth={4}
                strokeDasharray="5 5"
                name="Total"
                dot={{ fill: '#d32f2f', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmissionsTrendChart;
