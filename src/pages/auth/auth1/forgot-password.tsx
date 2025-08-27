import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';
import LanguageSelector from 'components/LanguageSelector';
import { useLanguage } from 'contexts/LanguageContext';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {
  const { isLoggedIn } = useAuth();
  const { t } = useLanguage();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        {/* Sélecteur de langue en haut à droite */}
        <Grid item xs={12} sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: -8, right: -8, zIndex: 1000 }}>
            <LanguageSelector />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('forgot-password')}</Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              {t('back-to-login')}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthForgotPassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
