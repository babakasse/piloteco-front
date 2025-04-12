// material-ui
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <MainCard title="Home">
      <Typography variant="body1">
      The SaaS environmental management tool for SMEs with a Marketplace.
      </Typography>
    </MainCard>
  );
}
