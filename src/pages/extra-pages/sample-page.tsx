// src/pages/SamplePage.tsx
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import CompanyCard from 'components/cards/company/CompanyCard';
import useCompany from 'hooks/useCompany';

export default function SamplePage() {
  const { company, user, loading } = useCompany();

  return (
    <MainCard title="Home">
      <Typography variant="body1" gutterBottom>
        PILOTECO – The SaaS environmental management tool for SMEs with a Marketplace.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : user ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Welcome, {user.firstName} {user.lastName}!
          </Typography>
          {company ? (
            <CompanyCard company={company} />
          ) : (
            <Typography color="warning" mt={2}>
              No company information available.
            </Typography>
          )}
        </Box>
      ) : (
        <Typography color="error" mt={2}>
          No user information found.
        </Typography>
      )}
    </MainCard>
  );
}
