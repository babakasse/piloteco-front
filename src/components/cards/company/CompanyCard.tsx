// src/components/CompanyCard.tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface Props {
  company: {
    name: string;
    address: string;
  };
}

export default function CompanyCard({ company }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{company.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {company.address}
        </Typography>
      </CardContent>
    </Card>
  );
}
