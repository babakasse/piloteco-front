import { Grid, Card, CardContent, Stack, Box, Typography } from '@mui/material';
import { Factory, Assessment, TrendingUp } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface CompanyStatsCardsProps {
  totalCompanies: number;
  activeAssessments: number;
  totalEmissions: number;
  excellentCompanies: number;
  assessmentsLoading: boolean;
}

export default function CompanyStatsCards({
  totalCompanies,
  activeAssessments,
  totalEmissions,
  excellentCompanies,
  assessmentsLoading
}: CompanyStatsCardsProps) {
  const { t } = useLanguage();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Factory color="primary" />
              <Box>
                <Typography variant="h4">{totalCompanies}</Typography>
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
                  {t('total-emissions')} ({t('tco2-equivalent')})
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
  );
}
