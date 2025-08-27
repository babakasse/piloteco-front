import { useLanguage } from 'contexts/LanguageContext';
import { Button, Typography, Box } from '@mui/material';

// Exemple d'utilisation du système de traduction
const TranslationExample = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('welcome')} - {language.toUpperCase()}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {t('dashboard')}: {t('carbon-assessment')}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} sx={{ mr: 1 }}>
          Switch to {language === 'fr' ? 'English' : 'Français'}
        </Button>

        <Button variant="outlined">{t('save')}</Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Current notifications: {t('notifications')}
      </Typography>
    </Box>
  );
};

export default TranslationExample;
