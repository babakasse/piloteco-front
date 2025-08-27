// src/components/cards/company/CompanyCard.tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Edit, Trash } from 'iconsax-react';

interface Props {
  company: {
    id: number;
    name: string;
    address: string;
    sector: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export default function CompanyCard({ company, onEdit, onDelete, isAdmin }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle1" fontWeight="bold">
            {company.name}
          </Typography>
          {isAdmin && (
            <Box>
              <IconButton size="small" onClick={onEdit}>
                <Edit size={16} />
              </IconButton>
              <IconButton size="small" onClick={onDelete} color="error">
                <Trash size={16} />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          <b>Secteur :</b> {company.sector}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Adresse :</b> {company.address}
        </Typography>
      </CardContent>
    </Card>
  );
}
