import { Grid, Card, CardContent, Box, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import EnvironmentalBadgeWithProgress from './EnvironmentalBadgeWithProgress';

interface Company {
  id: number;
  name: string;
  address?: string;
  sector?: string;
}

interface Assessment {
  id: number;
  assessmentDate?: string;
  createdAt: string;
  totalEmissions?: number;
}

interface CompanyDetailCardProps {
  company: Company;
  emissions: number;
  latestAssessment: Assessment | null;
  isRegularAdmin: boolean;
  onEdit: (company: Company) => void;
}

export default function CompanyDetailCard({ company, emissions, latestAssessment, isRegularAdmin, onEdit }: CompanyDetailCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
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

                  {emissions > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.5rem' }}>
                        🌍
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                          {t('total-emissions')}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 'medium', color: 'primary.main' }}>
                          {emissions.toLocaleString()} {t('tco2-equivalent')}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {latestAssessment && (
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
                  )}
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
                      onClick={() => onEdit(company)}
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
                <EnvironmentalBadgeWithProgress emissions={emissions} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
