import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAssessmentWithEmissions, deleteEmission } from '../api/carbonAssessment';
import SmartEmissionForm from '../components/SmartEmissionForm';
import BulkImportForm from '../components/BulkImportForm';
import SectorTemplateWizard from '../components/SectorTemplateWizard';
import EditEmissionModal from '../components/EditEmissionModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { t } = useLanguage();

  // États pour la modale d'édition et la suppression
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmission, setSelectedEmission] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emissionToDelete, setEmissionToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

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

  const refreshAssessment = () => {
    if (!id) return;
    setLoading(true);
    getAssessmentWithEmissions(parseInt(id))
      .then((data) => setAssessment(data))
      .finally(() => setLoading(false));
  };

  const handleEditEmission = (emission: any) => {
    setSelectedEmission(emission);
    setEditModalOpen(true);
  };

  const handleDeleteEmission = (emission: any) => {
    setEmissionToDelete(emission);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEmission = async () => {
    if (!emissionToDelete) return;

    setDeleting(true);
    try {
      await deleteEmission(emissionToDelete.id);
      refreshAssessment();
      setDeleteDialogOpen(false);
      setEmissionToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeleting(false);
    }
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
    <MainCard
      title={`${t('assessment-details')} : ${assessment.name}`}
      secondary={
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/assessment-edit/${id}`)}
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
        >
          {t('edit')}
        </Button>
      }
    >
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
                  <TableCell align="center">{t('actions')}</TableCell>
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
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title={t('edit')}>
                          <IconButton size="small" color="primary" onClick={() => handleEditEmission(em)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('delete')}>
                          <IconButton size="small" color="error" onClick={() => handleDeleteEmission(em)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
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
          {tabValue === 0 && <SmartEmissionForm assessmentId={assessment.id?.toString()} onSuccess={refreshAssessment} />}
          {tabValue === 1 && <BulkImportForm assessmentId={assessment.id?.toString() || ''} onSuccess={refreshAssessment} />}
          {tabValue === 2 && <SectorTemplateWizard assessmentId={assessment.id?.toString() || ''} onSuccess={refreshAssessment} />}
        </Box>
      </Box>

      {/* Modale d'édition d'émission */}
      <EditEmissionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        emission={selectedEmission}
        onSuccess={() => {
          refreshAssessment();
          setEditModalOpen(false);
        }}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('delete-emission')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirm-delete-emission')}
            {emissionToDelete && (
              <Box mt={1}>
                <strong>{emissionToDelete.source}</strong> - {emissionToDelete.category}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            {t('cancel')}
          </Button>
          <Button
            onClick={confirmDeleteEmission}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? t('deleting') : t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
