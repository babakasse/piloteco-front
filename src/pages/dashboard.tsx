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
import { EmojiObjects, Factory, LocalGasStation, Timeline } from '@mui/icons-material';

export default function Dashboard() {
  const { company, user, loading } = useCompany();
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
          // Cherche le plus récent qui a des émissions
          const found = assessments.find((a: any) => a.emissions && a.emissions.length > 0);
          const assessmentToShow = found || assessments[0];
          const summary = await getAssessmentWithEmissions(assessmentToShow.id);
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
    <MainCard title="Tableau de bord">
      <Typography variant="body1" gutterBottom>
        PILOTECO – L'outil SaaS de gestion environnementale pour les PME avec un Marketplace.
      </Typography>
      {/* Suppression de CompanyCard du dashboard */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : user ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Bienvenue, {user.firstName} {user.lastName} !
          </Typography>
          {/* CompanyCard supprimé ici */}
          {company ? null : (
            <Typography color="warning" mt={2}>
              Aucune information d'entreprise disponible.
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
                    📊 Métriques Clés
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title="Total Émissions"
                        value={carbonSummary.totalEmissions}
                        unit="kgCO₂e"
                        color="error"
                        icon={<Factory />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title="Scope 1 (Direct)"
                        value={carbonSummary.scope1Emissions || 0}
                        unit="kgCO₂e"
                        color="success"
                        icon={<LocalGasStation />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title="Scope 2 (Électricité)"
                        value={carbonSummary.scope2Emissions || 0}
                        unit="kgCO₂e"
                        color="info"
                        icon={<EmojiObjects />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricsCard
                        title="Scope 3 (Indirect)"
                        value={carbonSummary.scope3Emissions || 0}
                        unit="kgCO₂e"
                        color="warning"
                        icon={<Timeline />}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Section des graphiques */}
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    � Analyse Graphique des Émissions
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
                    {allAssessments.length > 1 && (
                      <Grid item xs={12}>
                        <EmissionsTrendChart assessments={allAssessments} />
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
                            📋 Résumé du Bilan Carbone
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography>Année : {carbonSummary.year}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                Date d'évaluation :{' '}
                                {carbonSummary.assessmentDate ? new Date(carbonSummary.assessmentDate).toLocaleDateString() : '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                Total émissions : <b>{carbonSummary.totalEmissions} kgCO₂e</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                Statut : <b>{carbonSummary.status}</b>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Box mt={2} mb={2}>
                            <Chip label={`Scope 1 : ${carbonSummary.scope1Emissions} kgCO₂e`} color="success" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`Scope 2 : ${carbonSummary.scope2Emissions} kgCO₂e`} color="info" sx={{ mr: 1, mb: 1 }} />
                            <Chip label={`Scope 3 : ${carbonSummary.scope3Emissions} kgCO₂e`} color="warning" sx={{ mb: 1 }} />
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
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📝 Détail des Émissions du Bilan Actuel
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Source</TableCell>
                            <TableCell>Catégorie</TableCell>
                            <TableCell>Scope</TableCell>
                            <TableCell>Quantité</TableCell>
                            <TableCell>Unité</TableCell>
                            <TableCell>Description</TableCell>
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
                                Aucune émission enregistrée
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
                Aucun bilan carbone trouvé pour cette entreprise.
              </Typography>
            )}
          </Box>
        </Box>
      ) : null}
      {/* Tableau de toutes les émissions de l'entreprise */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          📈 Historique Complet des Émissions
        </Typography>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Année</TableCell>
                    <TableCell>Bilan</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Scope</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Unité</TableCell>
                    <TableCell>Description</TableCell>
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
                        Aucune émission enregistrée pour l'entreprise.
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
                  Précédent
                </Button>
                <Typography variant="body2">
                  Page {emissionsPage} / {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={emissionsPage === totalPages}
                  onClick={() => setEmissionsPage((p) => Math.min(totalPages, p + 1))}
                >
                  Suivant
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </MainCard>
  );
}
