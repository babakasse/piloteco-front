import MainCard from 'components/MainCard';
import AssessmentForm from '../components/AssessmentForm';
import Typography from '@mui/material/Typography';

export default function AssessmentCreatePage() {
  return (
    <MainCard title="Nouveau bilan carbone">
      <Typography variant="body1" gutterBottom>
        Remplissez le formulaire ci-dessous pour créer un nouveau bilan carbone.
      </Typography>
      <AssessmentForm />
    </MainCard>
  );
}
