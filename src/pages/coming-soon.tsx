import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NatureIcon from '@mui/icons-material/Nature';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden'
}));

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Early access request:', email);
    setEmail('');
    alert("Merci ! Nous vous contacterons dès que l'application sera disponible.");
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <NatureIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h2" component="h1" fontWeight="bold">
              PilotÉco
            </Typography>
          </Box>

          <Chip label="BIENTÔT DISPONIBLE" color="secondary" sx={{ mb: 3, px: 2, py: 1, fontSize: '0.9rem', fontWeight: 'bold' }} />

          <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 300 }}>
            L'application arrive bientôt !
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Nous finalisons les derniers détails de votre plateforme de mesure d'empreinte carbone. Soyez les premiers informés de son
            lancement !
          </Typography>
        </Container>
      </HeroSection>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h3" gutterBottom color="primary">
                En préparation
              </Typography>

              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Notre équipe travaille d'arrache-pied pour vous proposer la meilleure expérience possible :
              </Typography>

              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5, fontSize: '1rem' } }}>
                <li>Interface intuitive pour la saisie de vos données</li>
                <li>Calculs précis selon les standards internationaux</li>
                <li>Rapports détaillés et recommandations personnalisées</li>
                <li>Tableau de bord pour suivre vos progrès</li>
                <li>Support complet pour vous accompagner</li>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)'
              }}
            >
              <RocketLaunchIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />

              <Typography variant="h5" gutterBottom>
                Accès prioritaire
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                Inscrivez-vous pour être averti dès le lancement et bénéficier d'un accès prioritaire.
              </Typography>

              <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <input
                      type="email"
                      placeholder="Votre email professionnel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    <Button type="submit" variant="contained" startIcon={<NotificationsIcon />} sx={{ whiteSpace: 'nowrap' }}>
                      Me prévenir
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Pas de spam, juste l'essentiel sur PilotÉco
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Return Home Button */}
        <Box textAlign="center" mt={6}>
          <Button variant="outlined" size="large" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ px: 4, py: 1.5 }}>
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoon;
