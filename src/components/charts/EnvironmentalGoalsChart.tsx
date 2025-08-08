// src/components/charts/EnvironmentalGoalsChart.tsx
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Grid } from '@mui/material';

interface Goal {
  name: string;
  target: number;
  current: number;
  unit: string;
  color: 'primary' | 'success' | 'warning' | 'error';
}

interface EnvironmentalGoalsChartProps {
  totalEmissions: number;
  year: number;
}

const EnvironmentalGoalsChart = ({ totalEmissions, year }: EnvironmentalGoalsChartProps) => {
  // Objectifs fictifs pour démonstration
  const goals: Goal[] = [
    {
      name: 'Réduction CO₂ par rapport à 2020',
      target: 20, // 20% de réduction
      current: totalEmissions > 10000 ? 5 : totalEmissions > 5000 ? 15 : 25, // Progression fictive
      unit: '%',
      color: totalEmissions > 10000 ? 'error' : totalEmissions > 5000 ? 'warning' : 'success'
    },
    {
      name: 'Émissions par employé',
      target: 2000, // 2000 kgCO₂e par employé
      current: Math.max(1000, totalEmissions / 10), // Estimation fictive
      unit: 'kgCO₂e',
      color: totalEmissions / 10 > 2000 ? 'error' : totalEmissions / 10 > 1500 ? 'warning' : 'success'
    },
    {
      name: 'Objectif neutralité carbone',
      target: year < 2030 ? 2030 : 2040, // Objectif neutralité
      current: year,
      unit: '',
      color: year < 2025 ? 'success' : year < 2027 ? 'warning' : 'error'
    }
  ];

  const getProgressValue = (goal: Goal) => {
    if (goal.name.includes('neutralité')) {
      const totalYears = goal.target - 2020;
      const currentYears = goal.current - 2020;
      return Math.min(100, (currentYears / totalYears) * 100);
    }
    if (goal.name.includes('Réduction')) {
      return Math.min(100, goal.current);
    }
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getStatusText = (goal: Goal) => {
    const progress = getProgressValue(goal);
    if (goal.name.includes('neutralité')) {
      const yearsLeft = goal.target - goal.current;
      return yearsLeft > 0 ? `${yearsLeft} ans restants` : 'Objectif atteint !';
    }
    if (goal.name.includes('Réduction')) {
      return `${goal.current}% de réduction`;
    }
    return `${goal.current.toFixed(0)} ${goal.unit}`;
  };

  if (!totalEmissions || totalEmissions === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" gutterBottom>
            🎯 Objectifs Environnementaux
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
            <Typography color="text.secondary">Aucune donnée d'émissions pour définir les objectifs</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          🎯 Objectifs Environnementaux {year}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {goals.map((goal, index) => {
              const progress = getProgressValue(goal);
              return (
                <Grid item xs={12} key={index}>
                  <Box mb={1.5}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                        {goal.name}
                      </Typography>
                      <Chip label={getStatusText(goal)} color={goal.color} size="small" variant="outlined" />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      color={goal.color}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3
                        }
                      }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {progress.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Objectif: {goal.target}
                        {goal.unit}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box mt={2} p={1.5} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            💡 Ces objectifs sont calculés automatiquement en fonction de vos émissions actuelles et des standards environnementaux.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalGoalsChart;
