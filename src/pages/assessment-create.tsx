import MainCard from 'components/MainCard';
import AssessmentForm from '../components/AssessmentForm';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentCreatePage() {
  const { t } = useLanguage();

  return (
    <MainCard title={t('create-new-assessment')}>
      <Typography variant="body1" gutterBottom>
        {t('create-assessment-description')}
      </Typography>
      <AssessmentForm />
    </MainCard>
  );
}
