// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Facebook, Google, Notification, Trash, DocumentText, Link21, MoneyRecive, Chart21, Timer1, Global, Flash } from 'iconsax-react';
import coming1 from 'assets/images/maintenance/img-soon-1-1.png';
import coming2 from 'assets/images/maintenance/img-soon-1-2.png';
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| COMING SOON ||============================== //

export default function ComingSoon() {
  return (
    <>
      <AuthBackground />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container justifyContent="center" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12}>
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
              <Stack spacing={{ xs: 6, md: 8 }}>
                {/* Header Section */}
                <Box textAlign="center">
                  <Chip
                    label="🚀 Bientôt disponible"
                    variant="outlined"
                    color="primary"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      borderRadius: 50,
                      px: 2,
                      py: 0.5
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                      lineHeight: 1.1,
                      mb: 3,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    PilotEco
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 3,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    Votre plateforme pour vous aider à suivre, réduire et valoriser votre impact environnemental.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '1.125rem', md: '1.5rem' },
                      background: 'linear-gradient(135deg, #1976d2 0%, #4caf50 50%, #ff9800 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 4
                    }}
                  >
                    Révolutionnez votre impact environnemental
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1.25rem', lineHeight: 1.6, maxWidth: 700, mx: 'auto' }}
                  >
                    Découvrez les fonctionnalités révolutionnaires qui transformeront votre approche de la gestion environnementale avec des
                    outils avancés pour une gestion durable et intelligente.
                  </Typography>
                </Box>

                {/* Feature Cards Grid */}
                <Box>
                  <Typography variant="h4" textAlign="center" color="primary.main" sx={{ fontWeight: 600, mb: 5 }}>
                    ✨ Nouvelles fonctionnalités à venir
                  </Typography>

                  <Grid container spacing={{ xs: 3, md: 4 }}>
                    {[
                      {
                        icon: <Trash variant="Bold" size={48} />,
                        title: 'Gestion des déchets intelligente',
                        description: 'Suivi optimisé avec carte interactive des centres de recyclage et optimisation des processus',
                        color: '#4CAF50',
                        bgColor: 'success'
                      },
                      {
                        icon: <DocumentText variant="Bold" size={48} />,
                        title: 'Rapports automatisés',
                        description: 'Génération PDF instantanée, exports CSV en temps réel et notifications intelligentes',
                        color: '#2196F3',
                        bgColor: 'info'
                      },
                      {
                        icon: <Link21 variant="Bold" size={48} />,
                        title: 'Intégrations ERP avancées',
                        description: 'Connexion transparente avec SAP, QuickBooks, API et synchronisation automatique',
                        color: '#FF9800',
                        bgColor: 'warning'
                      },
                      {
                        icon: <MoneyRecive variant="Bold" size={48} />,
                        title: 'Plans flexibles et scalables',
                        description: "Solutions adaptées à toutes les tailles d'entreprises avec options personnalisables",
                        color: '#9C27B0',
                        bgColor: 'secondary'
                      }
                    ].map((feature, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                          sx={{
                            p: { xs: 3, md: 4 },
                            height: '100%',
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: `${feature.bgColor}.light`,
                            borderRadius: 4,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-16px) scale(1.03)',
                              boxShadow: `0 16px 50px ${feature.color}30`,
                              borderColor: feature.color,
                              '& .feature-icon': {
                                transform: 'scale(1.3) rotate(10deg)',
                                color: feature.color
                              }
                            }
                          }}
                        >
                          <Box
                            className="feature-icon"
                            sx={{
                              mb: 3,
                              color: `${feature.bgColor}.main`,
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 2,
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              color: `${feature.bgColor}.dark`
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, lineHeight: 1.5 }}
                          >
                            {feature.description}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Dashboard Preview */}
                <Card
                  sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fff3e0 100%)',
                    border: '2px solid',
                    borderColor: 'primary.light',
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
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      animation: 'shimmer 3s infinite'
                    },
                    '@keyframes shimmer': {
                      '0%': { transform: 'translateX(-100%)' },
                      '100%': { transform: 'translateX(100%)' }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                      {[
                        { icon: <Chart21 variant="Bold" size={40} />, delay: '0s' },
                        { icon: <Timer1 variant="Bold" size={40} />, delay: '0.2s' },
                        { icon: <Global variant="Bold" size={40} />, delay: '0.4s' },
                        { icon: <Flash variant="Bold" size={40} />, delay: '0.6s' }
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            color: 'primary.main',
                            animation: 'bounce 2s infinite',
                            animationDelay: item.delay,
                            '@keyframes bounce': {
                              '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                              '40%': { transform: 'translateY(-12px)' },
                              '60%': { transform: 'translateY(-6px)' }
                            }
                          }}
                        >
                          {item.icon}
                        </Box>
                      ))}
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                        color: 'primary.dark'
                      }}
                    >
                      🎯 Tableau de bord intelligent
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        lineHeight: 1.6,
                        maxWidth: 600,
                        mx: 'auto'
                      }}
                    >
                      Analytics en temps réel, notifications automatiques et suivi personnalisé de vos objectifs environnementaux pour une
                      gestion optimale de votre empreinte carbone.
                    </Typography>
                  </Box>
                </Card>

                {/* Newsletter Section */}
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    borderRadius: 5,
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                    <Stack spacing={4}>
                      <Box textAlign="center">
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                          🔔 Restez informé des innovations
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Soyez les premiers à découvrir ces fonctionnalités révolutionnaires !
                        </Typography>
                      </Box>

                      <Box sx={{ maxWidth: 500, mx: 'auto', width: '100%' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField
                            fullWidth
                            placeholder="votre@email.com"
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                fontSize: '1.125rem',
                                py: 1,
                                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                              }
                            }}
                          />
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<Notification variant="Bold" />}
                            sx={{
                              minWidth: { xs: '100%', sm: 200 },
                              borderRadius: 3,
                              fontWeight: 600,
                              fontSize: '1.125rem',
                              textTransform: 'none',
                              py: 1.5,
                              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                              '&:hover': {
                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Me notifier
                          </Button>
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                        <Typography variant="body1" color="text.secondary">
                          Suivez-nous sur:
                        </Typography>
                        <IconButton
                          color="primary"
                          sx={{
                            borderRadius: 2,
                            p: 1.5,
                            '&:hover': { bgcolor: 'primary.lighter', transform: 'scale(1.1)' }
                          }}
                        >
                          <Facebook variant="Bulk" size={24} />
                        </IconButton>
                        <IconButton
                          color="primary"
                          sx={{
                            borderRadius: 2,
                            p: 1.5,
                            '&:hover': { bgcolor: 'primary.lighter', transform: 'scale(1.1)' }
                          }}
                        >
                          <Google variant="Bulk" size={24} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
