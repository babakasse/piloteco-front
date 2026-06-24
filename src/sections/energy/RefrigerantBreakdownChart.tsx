import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { RefrigerantBreakdownItemType } from 'types/energy';

// ==============================|| ENERGY — REFRIGERANT BREAKDOWN CHART ||============================== //

interface RefrigerantBreakdownChartProps {
  data: RefrigerantBreakdownItemType[];
  title: string;
}

const PIE_COLORS = [
  '#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0',
  '#00BCD4', '#FF5722', '#607D8B', '#795548', '#FFC107',
  '#8BC34A', '#03A9F4', '#F44336', '#673AB7', '#009688'
];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: LabelProps) {
  if (percentage < 3) return null; // hide tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${percentage.toFixed(1)}%`}
    </text>
  );
}

export default function RefrigerantBreakdownChart({ data, title }: RefrigerantBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" height={220}>
          <Typography color="text.secondary" variant="body2">
            No data
          </Typography>
        </Box>
      </Box>
    );
  }

  const chartData = data.map((d) => ({
    name: d.fluidType,
    value: d.totalKg,
    percentage: d.percentage
  }));

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {/* height=400: pie takes ~220px (top+bottom), ~130px reserved for legend */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="40%"
            labelLine={false}
            label={renderCustomLabel as any}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value.toFixed(1)} kg`, name]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8, lineHeight: '20px' }}
            formatter={(value) => {
              const item = chartData.find((d) => d.name === value);
              return `${value} (${item?.percentage.toFixed(1) ?? 0}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
