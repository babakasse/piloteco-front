import {
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Alert
} from '@mui/material';
import useCompany from 'hooks/useCompany';
import CompanyCard from 'components/cards/company/CompanyCard';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Add, Assessment, TrendingUp, Factory } from '@mui/icons-material';
import { getCompanyAssessments } from '../api/carbonAssessment';

export default function CompaniesPage() {
  const { companies, isAdmin, refreshCompanies } = useCompany();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [editValues, setEditValues] = useState({ name: '', address: '', sector: '' });
  const [newCompanyValues, setNewCompanyValues] = useState({ name: '', address: '', sector: '' });
  const [loading, setLoading] = useState(false);
  const [assessmentsData, setAssessmentsData] = useState<any[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Récupération des données d'évaluation carbone
  useEffect(() => {
    const fetchAssessments = async () => {
      setAssessmentsLoading(true);
      try {
        const assessments = await getCompanyAssessments();
        setAssessmentsData(assessments || []);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
        setAssessmentsData([]);
      } finally {
        setAssessmentsLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  // Calcul des statistiques basées sur les vraies données
  const totalEmissions = assessmentsData.reduce((acc, assessment) => acc + (assessment.totalEmissions || 0), 0);
  const activeAssessments = assessmentsData.filter(
    (assessment) => assessment.status === 'published' || assessment.status === 'draft'
  ).length;
  const excellentCompanies = assessmentsData.filter((assessment) => {
    const emissions = assessment.totalEmissions || 0;
    return emissions > 0 && emissions < 1000;
  }).length;

  // Fonction pour obtenir les données d'émissions d'une entreprise
  const getCompanyEmissions = (companyId: number) => {
    // Trouve le dernier bilan de cette entreprise
    const companyAssessments = assessmentsData.filter((assessment) => assessment.company?.id === companyId);
    if (companyAssessments.length === 0) return 0;

    // Retourne les émissions du bilan le plus récent
    const latestAssessment = companyAssessments.sort(
      (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
    )[0];

    return latestAssessment.totalEmissions || 0;
  };

  // Fonction pour obtenir le dernier bilan d'une entreprise
  const getLatestAssessment = (companyId: number) => {
    const companyAssessments = assessmentsData.filter((assessment) => assessment.company?.id === companyId);
    if (companyAssessments.length === 0) return null;

    return companyAssessments.sort(
      (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
    )[0];
  };

  const getEnvironmentalStatus = (emissions: number) => {
    if (emissions === 0) return { status: t('no-assessment-yet'), color: 'default' as const };
    if (emissions < 1000) return { status: t('excellent'), color: 'success' as const };
    if (emissions < 5000) return { status: t('good'), color: 'info' as const };
    if (emissions < 10000) return { status: t('needs-improvement'), color: 'warning' as const };
    return { status: t('critical'), color: 'error' as const };
  };

  const handleEditClick = (comp: any) => {
    setSelectedCompany(comp);
    setEditValues({ name: comp.name, address: comp.address, sector: comp.sector || '' });
    setEditOpen(true);
  };

  const handleEditChange = (e: any) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleNewCompanyChange = (e: any) => {
    setNewCompanyValues({ ...newCompanyValues, [e.target.name]: e.target.value });
  };

  const handleAddCompany = async () => {
    setLoading(true);
    try {
      await axios.post('/companies', newCompanyValues);
      setAddOpen(false);
      setNewCompanyValues({ name: '', address: '', sector: '' });
      refreshCompanies && refreshCompanies();
    } catch (error) {
      console.error('Failed to create company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch(`/companies/${selectedCompany.id}`, editValues, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });
      setEditOpen(false);
      refreshCompanies && refreshCompanies();
    } catch (error) {
      console.error('Failed to update company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (comp: any) => {
    setSelectedCompany(comp);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`/companies/${selectedCompany.id}`);
      setDeleteOpen(false);
      refreshCompanies && refreshCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {isAdmin ? t('manage-companies') : t('my-company')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin ? t('admin-companies-description') : t('user-company-description')}
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)} sx={{ borderRadius: 2 }}>
            {t('add-new-company')}
          </Button>
        )}
      </Box>

      {/* Statistics Cards for Admin */}
      {isAdmin && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Factory color="primary" />
                    <Box>
                      <Typography variant="h4">{companies?.length || 0}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('total-companies')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Assessment color="info" />
                    <Box>
                      <Typography variant="h4">{assessmentsLoading ? '...' : activeAssessments}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('active-assessments')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TrendingUp color="success" />
                    <Box>
                      <Typography variant="h4">{assessmentsLoading ? '...' : totalEmissions.toLocaleString()}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('total-emissions')} ({t('kg-co2-equivalent')})
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ color: 'warning.main' }}>🌱</Box>
                    <Box>
                      <Typography variant="h4">{assessmentsLoading ? '...' : excellentCompanies}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('excellent')} {t('environmental-status')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* Companies Grid */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isAdmin ? t('companies-overview') : t('company-dashboard')}
      </Typography>
      <Grid container spacing={2}>
        {companies && companies.length > 0 ? (
          companies.map((comp) => {
            const companyEmissions = getCompanyEmissions(comp.id);
            const latestAssessment = getLatestAssessment(comp.id);

            return (
              <Grid item xs={12} sm={6} md={4} key={comp.id}>
                <Card sx={{ position: 'relative', height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="div">
                        {comp.name}
                      </Typography>
                      <Chip
                        label={getEnvironmentalStatus(companyEmissions).status}
                        color={getEnvironmentalStatus(companyEmissions).color}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {comp.address || t('address-not-provided')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🏢 {comp.sector || t('sector-not-provided')}
                    </Typography>

                    {companyEmissions > 0 && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        🌍 {companyEmissions.toLocaleString()} {t('kg-co2-equivalent')}
                      </Typography>
                    )}

                    {latestAssessment && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        📅 {t('last-assessment')}:{' '}
                        {new Date(latestAssessment.assessmentDate || latestAssessment.createdAt).toLocaleDateString()}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/assessment-list`)}
                        sx={{ borderRadius: 1, textTransform: 'none' }}
                      >
                        {t('view-carbon-assessments')}
                      </Button>

                      {isAdmin && (
                        <>
                          <IconButton size="small" onClick={() => handleEditClick(comp)} color="primary">
                            ✏️
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(comp)} color="error">
                            🗑️
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography>{isAdmin ? t('no-company-found') : t('user-company-description')}</Typography>
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add Company Modal */}
      {isAdmin && (
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} sx={{ '& .MuiDialogContent-root': { pt: 2 } }}>
          <DialogTitle>{t('add-new-company')}</DialogTitle>
          <DialogContent>
            <TextField
              label={t('name')}
              name="name"
              value={newCompanyValues.name}
              onChange={handleNewCompanyChange}
              fullWidth
              sx={{ mb: 2, mt: 1 }}
              required
            />
            <TextField
              label={t('address')}
              name="address"
              value={newCompanyValues.address}
              onChange={handleNewCompanyChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField label={t('sector')} name="sector" value={newCompanyValues.sector} onChange={handleNewCompanyChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} disabled={loading}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddCompany} variant="contained" disabled={loading || !newCompanyValues.name}>
              {loading ? t('saving') : t('save')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Company Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} sx={{ '& .MuiDialogContent-root': { pt: 2 } }}>
        <DialogTitle>{t('edit-company')}</DialogTitle>
        <DialogContent>
          <TextField label={t('name')} name="name" value={editValues.name} onChange={handleEditChange} fullWidth sx={{ mb: 2, mt: 1 }} />
          <TextField label={t('address')} name="address" value={editValues.address} onChange={handleEditChange} fullWidth sx={{ mb: 2 }} />
          <TextField label={t('sector')} name="sector" value={editValues.sector} onChange={handleEditChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading}>
            {loading ? t('saving') : t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Company Modal */}
      {isAdmin && (
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>{t('delete-company')}</DialogTitle>
          <DialogContent>
            <Typography>{t('delete-company-confirmation')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)} disabled={loading}>
              {t('cancel')}
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
              {loading ? t('deleting') : t('delete')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
