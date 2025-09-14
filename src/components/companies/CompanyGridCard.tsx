import { Grid, Card, CardContent, Box, Typography, Stack, Button, IconButton } from '@mui/material';
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

interface CompanyGridCardProps {
  company: Company;
  emissions: number;
  latestAssessment: Assessment | null;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export default function CompanyGridCard({ company, emissions, latestAssessment, onEdit, onDelete }: CompanyGridCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={6} lg={4}>
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
                  {company.name}
                </Typography>

                {/* Informations détaillées */}
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                      📍
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {company.address || t('address-not-provided')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                      🏢
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {company.sector || t('sector-not-provided')}
                    </Typography>
                  </Box>

                  {emissions > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                        🌍
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', fontWeight: 'medium' }}>
                        {emissions.toLocaleString()} {t('tco2-equivalent')}
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
                    <IconButton size="small" onClick={() => onEdit(company)} color="primary">
                      ✏️
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(company)} color="error">
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
              <EnvironmentalBadgeWithProgress emissions={emissions} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
