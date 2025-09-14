import { Box, Chip, Typography, Tooltip, LinearProgress, Card, CardContent } from '@mui/material';
import { EmojiEvents, WorkspacePremium, Shield, Diamond, TrendingUp, Star } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface EnvironmentalBadgeWithProgressProps {
  emissions: number;
}

export default function EnvironmentalBadgeWithProgress({ emissions }: EnvironmentalBadgeWithProgressProps) {
  const { t } = useLanguage();

  const getEnvironmentalBadge = (emissions: number) => {
    if (emissions === 0)
      return {
        badge: t('no-assessment-yet'),
        color: 'default' as const,
        progress: 0,
        nextLevel: t('bronze-badge'),
        nextThreshold: 2000
      };

    // Seuils en tCO₂e (tonnes CO₂ équivalent) - Logique corrigée
    if (emissions <= 100)
      return {
        badge: t('platinum-badge'),
        color: 'info' as const,
        progress: 100, // Déjà au maximum
        nextLevel: null,
        nextThreshold: null
      };
    if (emissions <= 500)
      return {
        badge: t('gold-badge'),
        color: 'warning' as const,
        // Progression vers platinium : plus on s'approche de 100, plus le % augmente
        progress: Math.round(((500 - emissions) / (500 - 100)) * 100),
        nextLevel: t('platinum-badge'),
        nextThreshold: 100
      };
    if (emissions <= 1000)
      return {
        badge: t('silver-badge'),
        color: 'info' as const,
        // Progression vers or : plus on s'approche de 500, plus le % augmente
        progress: Math.round(((1000 - emissions) / (1000 - 500)) * 100),
        nextLevel: t('gold-badge'),
        nextThreshold: 500
      };

    // Bronze (plus de 1000 tCO₂e)
    // Progression vers argent : plus on s'approche de 1000, plus le % augmente
    const maxForBronze = 2000; // Au-delà, progression = 0%
    let progressValue = 0;
    if (emissions <= maxForBronze) {
      progressValue = Math.round(((maxForBronze - emissions) / (maxForBronze - 1000)) * 100);
    }

    return {
      badge: t('bronze-badge'),
      color: 'error' as const,
      progress: progressValue,
      nextLevel: t('silver-badge'),
      nextThreshold: 1000
    };
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Platine') || badge.includes('Platinum')) return <Diamond sx={{ fontSize: 16, color: '#2c3e50' }} />;
    if (badge.includes('Or') || badge.includes('Gold')) return <EmojiEvents sx={{ fontSize: 16, color: '#b8860b' }} />;
    if (badge.includes('Argent') || badge.includes('Silver')) return <WorkspacePremium sx={{ fontSize: 16, color: '#4a5568' }} />;
    if (badge.includes('Bronze')) return <Shield sx={{ fontSize: 16, color: '#744c2e' }} />;
    return <Star sx={{ fontSize: 16, color: '#9e9e9e' }} />;
  };

  const getBadgeDescription = (badge: string) => {
    if (badge.includes('Platine') || badge.includes('Platinum')) return t('platinum-description');
    if (badge.includes('Or') || badge.includes('Gold')) return t('gold-description');
    if (badge.includes('Argent') || badge.includes('Silver')) return t('silver-description');
    if (badge.includes('Bronze')) return t('bronze-description');
    return t('complete-first-assessment');
  };

  const getEmissionsToReduce = (emissions: number, nextThreshold: number) => {
    return Math.max(0, emissions - nextThreshold);
  };

  const thresholds = [
    { value: 0, label: '0', badge: t('platinum-badge'), color: '#4fc3f7' },
    { value: 100, label: '100', badge: t('gold-badge'), color: '#ffc107' },
    { value: 500, label: '500', badge: t('silver-badge'), color: '#9e9e9e' },
    { value: 1000, label: '1000', badge: t('bronze-badge'), color: '#8d6e63' },
    { value: 2000, label: '2000+', badge: '', color: '#f44336' }
  ];

  const getProgressPosition = (emissions: number) => {
    if (emissions <= 100) return (emissions / 100) * 25;
    if (emissions <= 500) return 25 + ((emissions - 100) / 400) * 25;
    if (emissions <= 1000) return 50 + ((emissions - 500) / 500) * 25;
    if (emissions <= 2000) return 75 + ((emissions - 1000) / 1000) * 25;
    return 100;
  };

  const badgeData = getEnvironmentalBadge(emissions);

  return (
    <Card sx={{ minWidth: 160, maxWidth: 280, width: '100%', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <CardContent sx={{ p: 2 }}>
        {/* En-tête du badge */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {t('current-badge')}
          </Typography>
        </Box>

        {/* Badge principal avec icône */}
        <Tooltip title={getBadgeDescription(badgeData.badge)} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
            {getBadgeIcon(badgeData.badge)}
            <Chip
              label={badgeData.badge}
              color={badgeData.color}
              size="medium"
              sx={{
                ml: 1,
                fontWeight: 'bold',
                '& .MuiChip-label': { fontSize: '0.85rem', px: 1 }
              }}
            />
          </Box>
        </Tooltip>

        {/* Émissions actuelles */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {emissions.toLocaleString()} tCO₂e
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('total-emissions')}
          </Typography>
        </Box>

        {/* Progression vers le prochain niveau */}
        {badgeData.nextLevel && badgeData.nextThreshold && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('next-goal')}: {badgeData.nextLevel}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {badgeData.progress}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={badgeData.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #4caf50, #2196f3)'
                }
              }}
            />

            {/* Réduction nécessaire */}
            {emissions > badgeData.nextThreshold && (
              <Box sx={{ mt: 1, p: 1, backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUp sx={{ fontSize: 14, color: '#1976d2' }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {t('reduction-needed')}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                  -{getEmissionsToReduce(emissions, badgeData.nextThreshold)} tCO₂e
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Barre de progression avec seuils (version compacte) */}
        {emissions > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1, display: 'block' }}>
              {t('environmental-scale')}
            </Typography>
            <Box sx={{ position: 'relative' }}>
              {/* Barre de fond avec segments */}
              <Box
                sx={{
                  height: 6,
                  bgcolor: '#f5f5f5',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Segments colorés */}
                <Box sx={{ position: 'absolute', top: 0, left: '0%', width: '25%', height: '100%', bgcolor: '#2c3e50', opacity: 0.3 }} />
                <Box sx={{ position: 'absolute', top: 0, left: '25%', width: '25%', height: '100%', bgcolor: '#b8860b', opacity: 0.3 }} />
                <Box sx={{ position: 'absolute', top: 0, left: '50%', width: '25%', height: '100%', bgcolor: '#4a5568', opacity: 0.3 }} />
                <Box sx={{ position: 'absolute', top: 0, left: '75%', width: '25%', height: '100%', bgcolor: '#744c2e', opacity: 0.3 }} />

                {/* Indicateur de position actuelle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    left: `${getProgressPosition(emissions)}%`,
                    transform: 'translateX(-50%)',
                    width: 10,
                    height: 10,
                    bgcolor: '#1976d2',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 1,
                    zIndex: 1
                  }}
                />
              </Box>

              {/* Légendes des seuils (simplifiées) */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#2c3e50', fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#b8860b', fontWeight: 'bold' }}>
                  100
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#4a5568', fontWeight: 'bold' }}>
                  500
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#744c2e', fontWeight: 'bold' }}>
                  1K+
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
