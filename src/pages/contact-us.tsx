import { useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

// project-imports
import MainCard from 'components/MainCard';
import { useLanguage } from '../contexts/LanguageContext';

// assets
import { MessageText, Call, Sms, Location, Clock } from 'iconsax-react';

export default function ContactUS() {
  const theme = useTheme();
  const [size, setSize] = useState('1');
  const [interest, setInterest] = useState('assessment');
  const { t } = useLanguage();

  // select company-size
  const sizes = [
    { value: '1', label: t('1-10-employees') },
    { value: '2', label: t('10-50-employees') },
    { value: '3', label: t('50-200-employees') },
    { value: '4', label: t('200-1000-employees') },
    { value: '5', label: t('1000-plus-employees') }
  ];

  // select interest areas for carbon assessment
  const interests = [
    { value: 'assessment', label: t('complete-carbon-assessment') },
    { value: 'reporting', label: t('reports-compliance') },
    { value: 'reduction', label: t('reduction-strategies') },
    { value: 'waste', label: t('waste-management') },
    { value: 'energy', label: t('energy-optimization') },
    { value: 'other', label: t('other') }
  ];

  const handleCompanySize = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSize(event.target?.value!);
  };

  const handleInterest = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInterest(event.target?.value!);
  };

  return (
    <MainCard title={t('contact-piloteco-experts')}>
      <Grid container spacing={4}>
        {/* Section Header */}
        <Grid item xs={12}>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              🌱 {t('talk-about-carbon-footprint')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {t('personalized-advice-description')}
            </Typography>
          </Box>
        </Grid>

        {/* Contact Info Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                <CardContent>
                  <MessageText variant="Bold" size={32} style={{ color: theme.palette.primary.main, marginBottom: 16 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('email')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    contact@piloteco.fr
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                <CardContent>
                  <Call variant="Bold" size={32} style={{ color: theme.palette.success.main, marginBottom: 16 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('phone')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +33 1 23 45 67 89
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                <CardContent>
                  <Location variant="Bold" size={32} style={{ color: theme.palette.warning.main, marginBottom: 16 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('address')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Rue de l'Environnement
                    <br />
                    75001 Paris, France
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                <CardContent>
                  <Clock variant="Bold" size={32} style={{ color: theme.palette.info.main, marginBottom: 16 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('phone-hours')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('monday-friday')}
                    <br />
                    {t('saturday')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              📋 {t('free-consultation-request')}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('first-name')} *
                  </Typography>
                  <TextField fullWidth type="text" placeholder={t('your-first-name')} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('last-name')} *
                  </Typography>
                  <TextField fullWidth type="text" placeholder={t('your-last-name')} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('email-address')} *
                  </Typography>
                  <TextField fullWidth type="email" placeholder={t('your-email')} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('phone')}
                  </Typography>
                  <TextField fullWidth type="tel" placeholder="+33 1 23 45 67 89" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('company')} *
                  </Typography>
                  <TextField fullWidth type="text" placeholder={t('your-company-name')} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('company-size')} *
                  </Typography>
                  <TextField select fullWidth value={size} onChange={handleCompanySize}>
                    {sizes.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('interest-area')} *
                  </Typography>
                  <TextField select fullWidth value={interest} onChange={handleInterest}>
                    {interests.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    {t('message')}
                  </Typography>
                  <TextField fullWidth multiline rows={4} placeholder={t('describe-needs')} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="flex-start" sx={{ ml: -1 }}>
                  <Checkbox sx={{ '& .css-1vjb4cj': { borderRadius: '2px' } }} defaultChecked />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('contact-consent')}{' '}
                    <Typography sx={{ cursor: 'pointer' }} component="span" color={theme.palette.primary.main}>
                      {t('terms-conditions')}
                    </Typography>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Sms variant="Bold" />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  {t('send-consultation-request')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bottom Info */}
        <Grid item xs={12}>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              💡 {t('response-guarantee')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}
