// src/pages/dashboard.tsx
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import CompanyCard from 'components/cards/company/CompanyCard';
import useCompany from 'hooks/useCompany';

export default function Dashboard() {
  const { company, user, loading } = useCompany();

  return (
    <MainCard title="Tableau de bord">
      <Typography variant="body1" gutterBottom>
        PILOTECO – L'outil SaaS de gestion environnementale pour les PME avec un Marketplace.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : user ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Bienvenue, {user.firstName} {user.lastName} !
          </Typography>
          {company ? (
            <CompanyCard company={company} />
          ) : (
            <Typography color="warning" mt={2}>
              Aucune information d'entreprise disponible.
            </Typography>
          )}
        </Box>
      ) : (
        <Typography color="error" mt={2}>
          Aucune information utilisateur trouvée.
        </Typography>
      )}
    </MainCard>
  );
} 