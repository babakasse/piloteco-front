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

// assets
import { MessageText, Call, Sms, Location, Clock } from 'iconsax-react';

// select company-size
const sizes = [
  { value: '1', label: '1 - 10 employés' },
  { value: '2', label: '10 - 50 employés' },
  { value: '3', label: '50 - 200 employés' },
  { value: '4', label: '200 - 1000 employés' },
  { value: '5', label: '1000+ employés' }
];

// select interest areas for carbon assessment
const interests = [
  { value: 'assessment', label: 'Évaluation carbone complète' },
  { value: 'reporting', label: 'Rapports et conformité' },
  { value: 'reduction', label: 'Stratégies de réduction' },
  { value: 'waste', label: 'Gestion des déchets' },
  { value: 'energy', label: 'Optimisation énergétique' },
  { value: 'other', label: 'Autre' }
];

// ==============================|| CONTACT US PAGE ||============================== //

export default function ContactUS() {
  const theme = useTheme();
  const [size, setSize] = useState('1');
  const [interest, setInterest] = useState('assessment');

  const handleCompanySize = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSize(event.target?.value!);
  };

  const handleInterest = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInterest(event.target?.value!);
  };

  return (
    <MainCard title="Contactez nos experts PilotEco">
      <Grid container spacing={4}>
        {/* Section Header */}
        <Grid item xs={12}>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              🌱 Parlons de votre empreinte carbone
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Obtenez des conseils personnalisés pour optimiser l'empreinte carbone de votre entreprise et atteindre vos objectifs
              environnementaux.
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
                    Email
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
                    Téléphone
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
                    Adresse
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
                    Horaires
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lun-Ven: 9h-18h
                    <br />
                    Sam: 9h-12h
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
              📋 Demande de consultation gratuite
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Prénom *
                  </Typography>
                  <TextField fullWidth type="text" placeholder="Votre prénom" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Nom *
                  </Typography>
                  <TextField fullWidth type="text" placeholder="Votre nom" />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Adresse email *
                  </Typography>
                  <TextField fullWidth type="email" placeholder="votre.email@entreprise.com" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Téléphone
                  </Typography>
                  <TextField fullWidth type="tel" placeholder="+33 1 23 45 67 89" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Entreprise *
                  </Typography>
                  <TextField fullWidth type="text" placeholder="Nom de votre entreprise" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="secondary">
                    Taille de l'entreprise *
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
                    Domaine d'intérêt *
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
                    Message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Décrivez-nous vos besoins en matière d'évaluation carbone et vos objectifs environnementaux..."
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="flex-start" sx={{ ml: -1 }}>
                  <Checkbox sx={{ '& .css-1vjb4cj': { borderRadius: '2px' } }} defaultChecked />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    J'accepte d'être contacté par PilotEco concernant mes besoins en évaluation carbone et je consens au traitement de mes
                    données selon les{' '}
                    <Typography sx={{ cursor: 'pointer' }} component="span" color={theme.palette.primary.main}>
                      Conditions Générales
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
                  Envoyer ma demande de consultation
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bottom Info */}
        <Grid item xs={12}>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              💡 Réponse garantie sous 24h • Consultation gratuite • Devis personnalisé
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}
