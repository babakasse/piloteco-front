// src/pages/dashboard.tsx
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getCompanyAssessments, getAssessmentWithEmissions } from '../api/carbonAssessment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import MainCard from 'components/MainCard';
import useCompany from 'hooks/useCompany';
import { useLanguage } from 'contexts/LanguageContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { ScopeDistributionChart, EmissionsByCategoryChart, EmissionsTrendChart, EnvironmentalGoalsChart } from 'components/charts';
import MetricsCard from 'components/cards/statistics/MetricsCard';
import BadgeGamification from 'components/BadgeGamification';
import { EmojiObjects, Factory, LocalGasStation, Timeline } from '@mui/icons-material';

export default function Dashboard() {
  const { company, user, loading } = useCompany();
  const { t } = useLanguage();
  const [carbonSummary, setCarbonSummary] = useState<any>(null);
  const [carbonLoading, setCarbonLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [allEmissions, setAllEmissions] = useState<any[]>([]);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  // Pagination pour la liste des émissions
  const [emissionsPage, setEmissionsPage] = useState(1);
  const emissionsPerPage = 10;
  const totalPages = Math.ceil(allEmissions.length / emissionsPerPage);
  const paginatedEmissions = allEmissions.slice((emissionsPage - 1) * emissionsPerPage, emissionsPage * emissionsPerPage);

  useEffect(() => {
    const fetchCarbon = async () => {
      setCarbonLoading(true);
      try {
        const assessments = await getCompanyAssessments();
        setAllAssessments(assessments || []);
        if (assessments && assessments.length > 0) {
          // Trie les bilans par année décroissante pour avoir le plus récent en premier
          const sortedAssessments = [...assessments].sort((a, b) => {
            const yearA = a.year || 0;
            const yearB = b.year || 0;
            return yearB - yearA; // Tri décroissant (plus récent en premier)
          });

          // Prend le bilan le plus récent
          const mostRecentAssessment = sortedAssessments[0];
          const summary = await getAssessmentWithEmissions(mostRecentAssessment.id);
          setCarbonSummary(summary);

          // Récupère toutes les émissions de tous les bilans
          const emissions = assessments.flatMap((a: any) =>
            a.emissions && Array.isArray(a.emissions)
              ? a.emissions.map((em: any) => ({ ...em, assessmentYear: a.year, assessmentName: a.name }))
              : []
          );
          setAllEmissions(emissions);
        } else {
          setAllEmissions([]);
          setAllAssessments([]);
        }
      } catch (e) {
        setCarbonSummary(null);
        setAllEmissions([]);
        setAllAssessments([]);
      } finally {
        setCarbonLoading(false);
      }
    };
    fetchCarbon();
  }, [refresh]);

  return (
    <MainCard title={t('carbon-footprint-essentials')} sx={{ mb: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : user ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('welcome-user', { firstName: user.firstName, lastName: user.lastName })}
          </Typography>
          {/* CompanyCard supprimé ici */}
          {company ? null : (
            <Typography color="warning" mt={2}>
              {t('no-company-info')}
            </Typography>
          )}
          {/* On garde le bilan carbone et les émissions détaillées */}
          <Box mt={3}>
            {carbonLoading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : carbonSummary ? (
              <>
                {/* Section des métriques clés */}
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    {t('key-metrics')}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title={t('total-emissions')}
                        value={carbonSummary.totalEmissions}
                        unit="tCO₂e"
                        color="error"
                        icon={<Factory />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title={t('scope-1-direct')}
                        value={carbonSummary.scope1Emissions || 0}
                        unit="tCO₂e"
                        color="success"
                        icon={<LocalGasStation />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title={t('scope-2-electricity')}
                        value={carbonSummary.scope2Emissions || 0}
                        unit="tCO₂e"
                        color="info"
                        icon={<EmojiObjects />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title={t('scope-3-indirect')}
                        value={carbonSummary.scope3Emissions || 0}
                        unit="tCO₂e"
                        color="warning"
                        icon={<Timeline />}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Système de gamification */}
                <Box mb={4}>
                  <BadgeGamification
                    emissions={carbonSummary.totalEmissions || 0}
                    companyName={company?.name}
                    onViewDetails={() => {
                      // Scroll vers la section des émissions détaillées
                      const emissionsSection = document.getElementById('emissions-details');
                      if (emissionsSection) {
                        emissionsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  />
                </Box>

                {/* Section des graphiques */}
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    {t('graphical-analysis')}
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Répartition par Scope */}
                    <Grid item xs={12} md={6}>
                      <ScopeDistributionChart
                        scope1={carbonSummary.scope1Emissions || 0}
                        scope2={carbonSummary.scope2Emissions || 0}
                        scope3={carbonSummary.scope3Emissions || 0}
                      />
                    </Grid>

                    {/* Émissions par catégorie */}
                    <Grid item xs={12} md={6}>
                      <EmissionsByCategoryChart emissions={carbonSummary.emissions || []} />
                    </Grid>

                    {/* Évolution des émissions dans le temps */}
                    {allAssessments && allAssessments.length > 1 && (
                      <Grid item xs={12}>
                        <EmissionsTrendChart assessments={allAssessments.filter((a) => a && a.year != null)} />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Section Résumé et Objectifs sur la même ligne */}
                <Box mb={4}>
                  <Grid container spacing={3}>
                    {/* Résumé du bilan carbone */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('carbon-footprint-summary')}
                          </Typography>
                          <Grid container spacing={2}>
                            métriques cléss
                            <Grid item xs={12}>
                              <Typography>
                                {t('year')} : {carbonSummary.year}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                {t('assessment-date')} :{' '}
                                {carbonSummary.assessmentDate ? new Date(carbonSummary.assessmentDate).toLocaleDateString() : '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                {t('total-emissions')} : <b>{carbonSummary.totalEmissions} tCO₂e</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                {t('status')} : <b>{carbonSummary.status}</b>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Box mt={2} mb={2}>
                            <Chip label={`Scope 1 : ${carbonSummary.scope1Emissions} tCO₂e`} color="success" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`Scope 2 : ${carbonSummary.scope2Emissions} tCO₂e`} color="info" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`Scope 3 : ${carbonSummary.scope3Emissions} tCO₂e`} color="warning" sx={{ mb: 1 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Objectifs environnementaux déplacés ici */}
                    <Grid item xs={12} md={6}>
                      <EnvironmentalGoalsChart
                        totalEmissions={carbonSummary.totalEmissions || 0}
                        year={carbonSummary.year || new Date().getFullYear()}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Tableau détaillé des émissions */}
                <Card id="emissions-details">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('emission-details')}
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('source')}</TableCell>
                            <TableCell>{t('category')}</TableCell>
                            <TableCell>{t('scope')}</TableCell>
                            <TableCell>{t('quantity')}</TableCell>
                            <TableCell>{t('unit')}</TableCell>
                            <TableCell>{t('description')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {carbonSummary.emissions && carbonSummary.emissions.length > 0 ? (
                            carbonSummary.emissions.map((em: any) => (
                              <TableRow key={em.id}>
                                <TableCell>{em.source}</TableCell>
                                <TableCell>{em.category}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={`Scope ${em.scope}`}
                                    color={em.scope === 1 ? 'success' : em.scope === 2 ? 'info' : 'warning'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{em.amount}</TableCell>
                                <TableCell>{em.unit}</TableCell>
                                <TableCell>{em.description}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                {t('no-emissions-recorded')}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Typography color="warning.main" mt={2}>
                {t('no-carbon-footprint')}
              </Typography>
            )}
          </Box>
        </Box>
      ) : null}
      {/* Tableau de toutes les émissions de l'entreprise */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {t('complete-emissions-history')}
        </Typography>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('year')}</TableCell>
                    <TableCell>{t('assessment')}</TableCell>
                    <TableCell>{t('source')}</TableCell>
                    <TableCell>{t('category')}</TableCell>
                    <TableCell>{t('scope')}</TableCell>
                    <TableCell>{t('quantity')}</TableCell>
                    <TableCell>{t('unit')}</TableCell>
                    <TableCell>{t('description')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allEmissions.length > 0 ? (
                    paginatedEmissions.map((em: any) => (
                      <TableRow key={em.id}>
                        <TableCell>{em.assessmentYear}</TableCell>
                        <TableCell>{em.assessmentName}</TableCell>
                        <TableCell>{em.source}</TableCell>
                        <TableCell>{em.category}</TableCell>
                        <TableCell>
                          <Chip
                            label={`Scope ${em.scope}`}
                            color={em.scope === 1 ? 'success' : em.scope === 2 ? 'info' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{em.quantity ?? em.amount}</TableCell>
                        <TableCell>{em.unit}</TableCell>
                        <TableCell>{em.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t('no-emissions-for-company')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination pour les émissions */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={emissionsPage === 1}
                  onClick={() => setEmissionsPage((p) => Math.max(1, p - 1))}
                >
                  {t('previous')}
                </Button>
                <Typography variant="body2">
                  {t('page')} {emissionsPage} / {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={emissionsPage === totalPages}
                  onClick={() => setEmissionsPage((p) => Math.min(totalPages, p + 1))}
                >
                  {t('next')}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </MainCard>
  );
}
