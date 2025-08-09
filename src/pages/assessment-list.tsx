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
import { useLanguage } from '../contexts/LanguageContext';

const AssessmentListPage: React.FC = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <MainCard title={t('carbon-assessments-list')}>
      <Typography variant="body1" gutterBottom>
        {t('assessments-description')}
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
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('year')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell>{t('total-emissions')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.length > 0 ? (
                assessments.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell>{a.description}</TableCell>
                    <TableCell>{a.totalEmissions} kgCO₂e</TableCell>
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
                        {a.status === 'published' ? t('published') : t('draft')}
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
                        {t('details')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {t('no-assessment-found')}
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
