import { Box, Typography, Divider, Grid, Button, Alert } from '@mui/material';
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
    </Box>
  );
}
