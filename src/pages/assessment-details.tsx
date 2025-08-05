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
import { getAssessmentWithEmissions } from '../api/carbonAssessment';
import EmissionForm from '../components/EmissionForm';
import Button from '@mui/material/Button';

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAssessmentWithEmissions(id)
      .then(data => setAssessment(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (!assessment) {
    return <Typography color="error">Aucun détail trouvé pour ce bilan.</Typography>;
  }

  return (
    <MainCard title={`Détails du bilan carbone : ${assessment.name}`}>
      <Typography variant="subtitle1" gutterBottom>Année : {assessment.year}</Typography>
      <Typography variant="subtitle1" gutterBottom>Description : {assessment.description || '-'}</Typography>
      <Typography variant="subtitle1" gutterBottom>Date d'évaluation : {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleDateString() : '-'}</Typography>
      <Typography variant="subtitle1" gutterBottom>Statut : {assessment.status}</Typography>
      <Typography variant="subtitle1" gutterBottom>Total émissions : {assessment.totalEmissions} tCO2e</Typography>
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>Émissions associées</Typography>
        {assessment.emissions && assessment.emissions.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Unité</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Description</TableCell>
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
          <Typography>Aucune émission associée à ce bilan.</Typography>
        )}
      </Box>
      <Box mt={4}>
        <Button
          variant={showForm ? 'outlined' : 'contained'}
          color={showForm ? 'secondary' : 'primary'}
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, px: 3, py: 1 }}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Fermer le formulaire' : 'Ajouter une émission'}
        </Button>
        {showForm && (
          <EmissionForm assessmentId={assessment.id?.toString()} onSuccess={() => window.location.reload()} />
        )}
      </Box>
    </MainCard>
  );
}
