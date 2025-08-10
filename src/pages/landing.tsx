import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, Link, Card, CardContent, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import NatureIcon from '@mui/icons-material/Nature';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ScrollToTop from 'components/ScrollToTop';
import LANDING_CONFIG from 'config/landing';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.1
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2rem'
});

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Remplacez 'YOUR_FORM_ID' par votre vrai Form ID de Formspree
      const response = await fetch('https://formspree.io/f/xyzplnzw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          message: 'Inscription newsletter PilotÉco',
          source: 'Landing Page'
        })
      });

      if (response.ok) {
        setEmail('');
        setSubmitted(true);
        // Réinitialiser le message après 5 secondes
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <LogoContainer>
            <NatureIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h2" component="h1" fontWeight="bold">
              {LANDING_CONFIG.hero.title}
            </Typography>
          </LogoContainer>

          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 300 }}>
            {LANDING_CONFIG.hero.subtitle}
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            {LANDING_CONFIG.hero.description}
          </Typography>
        </Container>
      </HeroSection>

      {/* Problem Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom color="primary">
            Pourquoi agir maintenant ?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Les réglementations environnementales se renforcent. Mesurer et réduire vos émissions de CO₂ n'est plus une option, c'est une
            nécessité pour votre entreprise.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <BarChartIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nouvelles réglementations
              </Typography>
              <Typography color="text.secondary">Les entreprises doivent désormais reporter leurs émissions carbone</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <TrendingDownIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Avantage concurrentiel
              </Typography>
              <Typography color="text.secondary">Les clients privilégient les entreprises éco-responsables</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <ThumbUpIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Économies réelles
              </Typography>
              <Typography color="text.secondary">Réduire son empreinte carbone = réduire ses coûts</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Solution Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom color="primary">
              Notre solution
            </Typography>
            <Typography variant="h6" color="text.secondary">
              PilotÉco vous accompagne à chaque étape de votre démarche environnementale
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <Typography variant="h4" color="white">
                      1
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Saisie simple
                  </Typography>
                  <Typography color="text.secondary">
                    Renseignez vos données environnementales en quelques clics avec notre interface intuitive
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <Typography variant="h4" color="white">
                      2
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Calcul automatique
                  </Typography>
                  <Typography color="text.secondary">
                    Obtenez instantanément votre bilan carbone calculé selon les standards internationaux
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <Typography variant="h4" color="white">
                      3
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Recommandations
                  </Typography>
                  <Typography color="text.secondary">Recevez des actions concrètes et personnalisées pour réduire vos émissions</Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white'
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Intéressé par PilotÉco ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Laissez-nous vos coordonnées pour être informé du lancement de notre solution
          </Typography>

          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    ✅ Merci !
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Nous vous recontacterons dès que PilotÉco sera disponible.
                  </Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    variant="outlined"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent'
                        }
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={isSubmitting}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      minWidth: '140px',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      },
                      '&:disabled': {
                        color: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,0.5)'
                      }
                    }}
                  >
                    {isSubmitting ? 'Envoi...' : 'Être recontacté'}
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <NatureIcon sx={{ mr: 1 }} />
                <Typography variant="h6">PilotÉco</Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                La solution simple et efficace pour mesurer et réduire l'empreinte carbone de votre entreprise.
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="grey.400">
                Email: contact@piloteco.fr
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Légal
              </Typography>
              <Link href="/mentions-legales" color="grey.400" sx={{ display: 'block', mb: 1 }}>
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" color="grey.400" sx={{ display: 'block' }}>
                Politique de confidentialité
              </Link>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: 1, borderColor: 'grey.800', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.400">
              © 2025 PilotÉco. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>

      <ScrollToTop />
    </Box>
  );
};

export default LandingPage;
