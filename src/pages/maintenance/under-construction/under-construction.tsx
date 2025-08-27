import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import { useLanguage } from 'contexts/LanguageContext';

// assets
import construction from 'assets/images/maintenance/img-cunstruct-1.svg';
import constructionBg from 'assets/images/maintenance/img-cunstruct-1-bg.png';
import constructionbottom from 'assets/images/maintenance/img-cunstruct-1-bottom.svg';

// ==============================|| UNDER CONSTRUCTION ||============================== //

export default function UnderConstruction() {
  const { t } = useLanguage();

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: `url(${constructionBg})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}>
      <Container fixed sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 2,
            backgroundImage: `url(${constructionbottom})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom'
          }}
        >
          <Grid item md={6}>
            <Stack spacing={2} justifyContent="center" alignItems="center">
              <Typography align="center" variant="h1">
                {t('under-construction')}
              </Typography>
              <Typography color="text.secondary" align="center" sx={{ width: '85%' }}>
                {t('under-construction-description')}
              </Typography>
              <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
                {t('back-to-home')}
              </Button>
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Box sx={{ width: { xs: 300, sm: 374 } }}>
              <img src={construction} alt="under construction" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
