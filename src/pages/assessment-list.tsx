import React, { useEffect, useState } from 'react';
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
import { getCompanyAssessments } from '../api/carbonAssessment';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from './AssessmentForm';

const AssessmentListPage: React.FC = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const data = await getCompanyAssessments();
        setAssessments(data);
      } catch (e) {
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <MainCard title="Liste des bilans carbone">
      <Typography variant="body1" gutterBottom>
        Retrouvez ici tous vos bilans carbone. Vous pouvez ajouter des émissions à chaque bilan.
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Année</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Total émissions</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.length > 0 ? (
                assessments.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell>{a.description}</TableCell>
                    <TableCell>{a.totalEmissions} tCO₂e</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: a.status === 'published' ? '#e8f5e8' : '#fff3cd',
                          color: a.status === 'published' ? '#2e7d32' : '#856404'
                        }}
                      >
                        {a.status === 'published' ? 'Publié' : 'Brouillon'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 0.5, ml: 1, textTransform: 'none' }}
                        onClick={() => navigate(`/assessment/${a.id}`)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun bilan trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
};

export default AssessmentListPage;
