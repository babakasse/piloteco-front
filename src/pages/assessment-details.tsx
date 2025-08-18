import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getAssessmentWithEmissions } from '../api/carbonAssessment';
import SmartEmissionForm from '../components/SmartEmissionForm';
import BulkImportForm from '../components/BulkImportForm';
import SectorTemplateWizard from '../components/SectorTemplateWizard';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAssessmentWithEmissions(parseInt(id))
      .then((data) => setAssessment(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assessment) {
    return <Typography color="error">{t('no-details-found')}</Typography>;
  }

  return (
    <MainCard title={`${t('assessment-details')} : ${assessment.name}`}>
      <Typography variant="subtitle1" gutterBottom>
        {t('year')} : {assessment.year}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t('description')} : {assessment.description || '-'}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t('assessment-date')} : {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleDateString() : '-'}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t('status')} : {assessment.status}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t('total-emissions')} : {assessment.totalEmissions} tCO₂e
      </Typography>

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          {t('associated-emissions')}
        </Typography>
        {assessment.emissions && assessment.emissions.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('source')}</TableCell>
                  <TableCell>{t('category')}</TableCell>
                  <TableCell>{t('amount')}</TableCell>
                  <TableCell>{t('unit')}</TableCell>
                  <TableCell>{t('scope')}</TableCell>
                  <TableCell>{t('description')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessment.emissions.map((em: any) => (
                  <TableRow key={em.id}>
                    <TableCell>{em.source}</TableCell>
                    <TableCell>{em.category}</TableCell>
                    <TableCell>{em.amount}</TableCell>
                    <TableCell>{em.unit}</TableCell>
                    <TableCell>{em.scope}</TableCell>
                    <TableCell>{em.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>{t('no-emissions-associated')}</Typography>
        )}
      </Box>

      <Box mt={4}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="emission tabs">
          <Tab label="🎯 Saisie Intelligente" />
          <Tab label="📊 Import en masse" />
          <Tab label="🚀 Assistant Secteur" />
        </Tabs>

        <Box mt={2}>
          {tabValue === 0 && <SmartEmissionForm assessmentId={assessment.id?.toString()} onSuccess={() => window.location.reload()} />}
          {tabValue === 1 && <BulkImportForm assessmentId={assessment.id?.toString() || ''} onSuccess={() => window.location.reload()} />}
          {tabValue === 2 && (
            <SectorTemplateWizard assessmentId={assessment.id?.toString() || ''} onSuccess={() => window.location.reload()} />
          )}
        </Box>
      </Box>
    </MainCard>
  );
}
