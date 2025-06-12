// src/pages/SamplePage.tsx
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import CompanyCard from 'components/cards/company/CompanyCard';
import useCompany from 'hooks/useCompany';

export default function SamplePage() {
  const { company, loading } = useCompany();

  return (
    <MainCard title="Home">
      <Typography variant="body1" gutterBottom>
        PILOTECO – The SaaS environmental management tool for SMEs with a Marketplace.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : company ? (
        <CompanyCard company={company} />
      ) : (
        <Typography color="error" mt={2}>
          No company information found.
        </Typography>
      )}
    </MainCard>
  );
}
