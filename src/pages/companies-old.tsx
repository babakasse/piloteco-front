import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  Alert
} from '@mui/material';
import useCompany from 'hooks/useCompany';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { getCompanyAssessments } from '../api/carbonAssessment';

// Import des nouveaux composants
import CompanyStatsCards from '../components/companies/CompanyStatsCards';
import CompanyGridCard from '../components/companies/CompanyGridCard';
import CompanyDetailCard from '../components/companies/CompanyDetailCard';
import CompanyModals from '../components/companies/CompanyModals';

export default function CompaniesPage() {
  const { companies, isAdmin, refreshCompanies, user, company, isSuperAdmin } = useCompany();
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

  // Vérification des rôles
  const isRegularAdmin = isAdmin && !isSuperAdmin;

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

    if (companyAssessments.length === 0) {
      // Si pas d'assessments spécifiques à cette entreprise,
      // utiliser tous les assessments si l'entreprise courante correspond
      if (assessmentsData.length > 0 && company && company.id === companyId) {
        const latestAssessment = assessmentsData.sort(
          (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
        )[0];
        return latestAssessment?.totalEmissions || 0;
      }
      return 0;
    }

    // Retourne les émissions du bilan le plus récent
    const latestAssessment = companyAssessments.sort(
      (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
    )[0];

    return latestAssessment.totalEmissions || 0;
  };

  // Fonction pour obtenir le dernier bilan d'une entreprise
  const getLatestAssessment = (companyId: number) => {
    const companyAssessments = assessmentsData.filter((assessment) => assessment.company?.id === companyId);

    if (companyAssessments.length === 0) {
      // Si pas d'assessments spécifiques à cette entreprise,
      // utiliser tous les assessments si l'entreprise courante correspond
      if (assessmentsData.length > 0 && company && company.id === companyId) {
        return assessmentsData.sort(
          (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
        )[0];
      }
      return null;
    }

    return companyAssessments.sort(
      (a, b) => new Date(b.assessmentDate || b.createdAt).getTime() - new Date(a.assessmentDate || a.createdAt).getTime()
    )[0];
  };

  // Handlers pour les modales
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
      {/* Information for Regular Admins without company */}
      {isRegularAdmin && !company && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('access-restricted')}
          </Typography>
          <Typography>{t('company-management-restricted')}</Typography>
        </Alert>
      )}

      {/* Access Denied for Users without company access */}
      {!isSuperAdmin && !isRegularAdmin && !company && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('access-denied')}
          </Typography>
          <Typography>{t('insufficient-permissions')}</Typography>
        </Alert>
      )}

      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {isSuperAdmin ? t('manage-companies') : isRegularAdmin ? t('company-profile') : t('company')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSuperAdmin
              ? t('super-admin-companies-description')
              : isRegularAdmin
                ? t('admin-company-description')
                : t('user-company-description')}
          </Typography>
        </Box>
        {isSuperAdmin && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)} sx={{ borderRadius: 2 }}>
            {t('add-new-company')}
          </Button>
        )}
        {isRegularAdmin && company && (
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleEditClick(company)} sx={{ borderRadius: 2 }}>
            {t('edit-my-company')}
          </Button>
        )}
      </Box>

            {/* Statistics Cards for Super Admin only */}
      {isSuperAdmin && (
        <>
          <CompanyStatsCards
            totalCompanies={companies?.length || 0}
            activeAssessments={activeAssessments}
            totalEmissions={totalEmissions}
            excellentCompanies={excellentCompanies}
            assessmentsLoading={assessmentsLoading}
          />
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* Companies Grid */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isSuperAdmin ? t('companies-overview') : isRegularAdmin ? t('company-information') : t('company-dashboard')}
      </Typography>
      <Grid container spacing={2}>
        {/* Super Admin: Show all companies */}
        {isSuperAdmin && companies && companies.length > 0 ? (
          companies.map((comp) => {
            const companyEmissions = getCompanyEmissions(comp.id);
            const latestAssessment = getLatestAssessment(comp.id);

            return (
              <CompanyGridCard
                key={comp.id}
                company={comp}
                emissions={companyEmissions}
                latestAssessment={latestAssessment}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            );
          })
        ) : /* Regular Admin or User: Show only their company */
        (isRegularAdmin || !isSuperAdmin) && company ? (
          <CompanyDetailCard
            company={company}
            emissions={getCompanyEmissions(company.id)}
            latestAssessment={getLatestAssessment(company.id)}
            isRegularAdmin={isRegularAdmin}
            onEdit={handleEditClick}
          />
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography>
                {isSuperAdmin ? t('no-company-found') : isRegularAdmin ? t('user-company-description') : t('user-company-description')}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Company Modals */}
      <CompanyModals
        editOpen={editOpen}
        selectedCompany={selectedCompany}
        editValues={editValues}
        onEditClose={() => setEditOpen(false)}
        onEditChange={handleEditChange}
        onEditSubmit={handleEditSubmit}
        deleteOpen={deleteOpen}
        onDeleteClose={() => setDeleteOpen(false)}
        onDeleteConfirm={handleDeleteConfirm}
        addOpen={addOpen}
        newCompanyValues={newCompanyValues}
        onAddClose={() => setAddOpen(false)}
        onNewCompanyChange={handleNewCompanyChange}
        onAddSubmit={handleAddCompany}
        loading={loading}
      />

      {/* Companies Grid */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isSuperAdmin ? t('companies-overview') : isRegularAdmin ? t('company-information') : t('company-dashboard')}
      </Typography>
      <Grid container spacing={2}>
        {/* Super Admin: Show all companies */}
        {isSuperAdmin && companies && companies.length > 0 ? (
          companies.map((comp) => {
            const companyEmissions = getCompanyEmissions(comp.id);
            const latestAssessment = getLatestAssessment(comp.id);

            return (
              <Grid item xs={12} sm={6} md={6} lg={4} key={comp.id}>
                <Card sx={{ position: 'relative', height: '100%', minHeight: 280 }}>
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    {/* Layout principal : 50% gauche / 50% droite */}
                    <Box
                      sx={{
                        display: 'flex',
                        height: '100%',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}
                    >
                      {/* Partie gauche : Informations de la compagnie */}
                      <Box
                        sx={{
                          flex: { xs: 1, sm: '1' },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minWidth: 0
                        }}
                      >
                        {/* Nom de la compagnie */}
                        <Box>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              mb: 2,
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              lineHeight: 1.3
                            }}
                          >
                            {comp.name}
                          </Typography>

                          {/* Informations détaillées */}
                          <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                                📍
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                                {comp.address || t('address-not-provided')}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                                🏢
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                                {comp.sector || t('sector-not-provided')}
                              </Typography>
                            </Box>

                            {companyEmissions > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                                  🌍
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', fontWeight: 'medium' }}>
                                  {companyEmissions.toLocaleString()} {t('tco2-equivalent')}
                                </Typography>
                              </Box>
                            )}

                            {latestAssessment && (
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                                  📅
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                  {t('last-assessment')}:{' '}
                                  {new Date(latestAssessment.assessmentDate || latestAssessment.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>

                        {/* Actions en bas */}
                        <Box>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/assessment-list`)}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                px: 2
                              }}
                            >
                              {t('view-carbon-assessments')}
                            </Button>

                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" onClick={() => handleEditClick(comp)} color="primary">
                                ✏️
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteClick(comp)} color="error">
                                🗑️
                              </IconButton>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>

                      {/* Partie droite : Badge environnemental */}
                      <Box
                        sx={{
                          flex: { xs: '0 0 auto', sm: '1' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: { xs: 120, sm: 'auto' },
                          borderLeft: { xs: 'none', sm: '1px solid' },
                          borderLeftColor: { xs: 'transparent', sm: 'divider' },
                          borderTop: { xs: '1px solid', sm: 'none' },
                          borderTopColor: { xs: 'divider', sm: 'transparent' },
                          pt: { xs: 2, sm: 0 },
                          pl: { xs: 0, sm: 2 }
                        }}
                      >
                        <EnvironmentalBadgeWithProgress emissions={companyEmissions} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : /* Regular Admin or User: Show only their company */
        (isRegularAdmin || !isSuperAdmin) && company ? (
          <Grid item xs={12}>
            <Card sx={{ position: 'relative', minHeight: 300 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Layout principal : 50% gauche / 50% droite */}
                <Box
                  sx={{
                    display: 'flex',
                    minHeight: 250,
                    gap: 3,
                    flexDirection: { xs: 'column', md: 'row' }
                  }}
                >
                  {/* Partie gauche : Informations de la compagnie */}
                  <Box
                    sx={{
                      flex: { xs: 1, md: '1' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minWidth: 0
                    }}
                  >
                    {/* Nom de la compagnie */}
                    <Box>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          mb: 3,
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        {company.name}
                      </Typography>

                      {/* Informations détaillées */}
                      <Stack spacing={2.5} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.5rem' }}>
                            📍
                          </Typography>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                              {t('address')}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                              {company.address || t('address-not-provided')}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.5rem' }}>
                            🏢
                          </Typography>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                              {t('sector')}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                              {company.sector || t('sector-not-provided')}
                            </Typography>
                          </Box>
                        </Box>

                        {getCompanyEmissions(company.id) > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.5rem' }}>
                              🌍
                            </Typography>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                                {t('total-emissions')}
                              </Typography>
                              <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 'medium', color: 'primary.main' }}>
                                {getCompanyEmissions(company.id).toLocaleString()} {t('tco2-equivalent')}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {(() => {
                          const latestAssessment = getLatestAssessment(company.id);
                          return (
                            latestAssessment && (
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.5rem' }}>
                                  📅
                                </Typography>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                                    {t('last-assessment')}
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {new Date(latestAssessment.assessmentDate || latestAssessment.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            )
                          );
                        })()}
                      </Stack>
                    </Box>

                    {/* Actions en bas */}
                    <Box>
                      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                        <Button
                          size="medium"
                          variant="outlined"
                          onClick={() => navigate(`/assessment-list`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            py: 1
                          }}
                        >
                          {t('view-carbon-assessments')}
                        </Button>

                        {isRegularAdmin && (
                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => handleEditClick(company)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              px: 3,
                              py: 1
                            }}
                          >
                            {t('edit')}
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  </Box>

                  {/* Partie droite : Badge environnemental */}
                  <Box
                    sx={{
                      flex: { xs: '0 0 auto', md: '1' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: { xs: 180, md: 'auto' },
                      borderLeft: { xs: 'none', md: '2px solid' },
                      borderLeftColor: { xs: 'transparent', md: 'divider' },
                      borderTop: { xs: '2px solid', md: 'none' },
                      borderTopColor: { xs: 'divider', md: 'transparent' },
                      pt: { xs: 3, md: 0 },
                      pl: { xs: 0, md: 3 }
                    }}
                  >
                    <Box sx={{ transform: 'scale(1.2)' }}>
                      <EnvironmentalBadgeWithProgress emissions={getCompanyEmissions(company.id)} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography>
                {isSuperAdmin ? t('no-company-found') : isRegularAdmin ? t('user-company-description') : t('user-company-description')}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add Company Modal - Super Admin only */}
      {isSuperAdmin && (
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

      {/* Edit Company Modal - Available for Super Admin and Regular Admin */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} sx={{ '& .MuiDialogContent-root': { pt: 2 } }}>
        <DialogTitle>{isSuperAdmin ? t('edit-company') : t('edit-my-company')}</DialogTitle>
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

      {/* Delete Company Modal - Super Admin only */}
      {isSuperAdmin && (
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
