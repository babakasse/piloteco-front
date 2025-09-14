import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import AssessmentForm from '../components/AssessmentForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getAssessmentWithEmissions } from '../api/carbonAssessment';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/assessment-list');
      return;
    }

    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const data = await getAssessmentWithEmissions(parseInt(id, 10));
        setAssessment(data);
      } catch (err: any) {
        setError(err.response?.data?.message || t('assessment-not-found'));
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, navigate, t]);

  const handleSuccess = (updatedAssessment: any) => {
    // Redirection vers la liste des bilans après modification
    setTimeout(() => {
      navigate('/assessment-list');
    }, 1500);
  };

  if (loading) {
    return (
      <MainCard title={t('edit-assessment')}>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard title={t('edit-assessment')}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </MainCard>
    );
  }

  return (
    <MainCard title={t('edit-assessment')}>
      <Typography variant="body1" gutterBottom>
        {t('edit-assessment-description')}
      </Typography>
      <AssessmentForm assessment={assessment} isEdit={true} onSuccess={handleSuccess} />
    </MainCard>
  );
}
