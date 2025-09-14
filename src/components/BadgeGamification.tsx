import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Tooltip,
  Slide,
  Zoom,
  useTheme,
  alpha,
  Grow
} from '@mui/material';
import {
  EmojiEvents,
  WorkspacePremium,
  Shield,
  TrendingUp,
  Star,
  KeyboardArrowRight,
  LocalFireDepartment,
  Nature,
  Diamond
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface BadgeGamificationProps {
  emissions: number;
  companyName?: string;
  onViewDetails?: () => void;
}

interface BadgeLevel {
  name: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  threshold: number;
  description: string;
  motivationalMessage: string;
  benefits: string[];
}

const BadgeGamification: React.FC<BadgeGamificationProps> = ({ emissions, companyName = '', onViewDetails }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Définition des niveaux de badges avec gamification - Couleurs optimisées pour la lisibilité
  const badgeLevels: BadgeLevel[] = [
    {
      name: t('platinum-badge'),
      icon: <Diamond sx={{ fontSize: 28 }} />,
      color: '#2c3e50', // Bleu foncé pour bon contraste
      bgColor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', // Fond très clair
      threshold: 100,
      description: t('platinum-description'),
      motivationalMessage: t('platinum-congrats'),
      benefits: [t('platinum-benefit-1'), t('platinum-benefit-2'), t('platinum-benefit-3')]
    },
    {
      name: t('gold-badge'),
      icon: <EmojiEvents sx={{ fontSize: 28 }} />,
      color: '#b8860b', // Or foncé pour meilleur contraste
      bgColor: 'linear-gradient(135deg, #fff8dc 0%, #ffeaa7 100%)', // Fond doré clair
      threshold: 500,
      description: t('gold-description'),
      motivationalMessage: t('gold-motivation'),
      benefits: [t('gold-benefit-1'), t('gold-benefit-2')]
    },
    {
      name: t('silver-badge'),
      icon: <WorkspacePremium sx={{ fontSize: 28 }} />,
      color: '#4a5568', // Gris foncé pour bon contraste
      bgColor: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', // Fond argenté clair
      threshold: 1000,
      description: t('silver-description'),
      motivationalMessage: t('silver-motivation'),
      benefits: [t('silver-benefit-1')]
    },
    {
      name: t('bronze-badge'),
      icon: <Shield sx={{ fontSize: 28 }} />,
      color: '#744c2e', // Bronze foncé pour bon contraste
      bgColor: 'linear-gradient(135deg, #fdf6e3 0%, #f4e4c1 100%)', // Fond bronze clair
      threshold: 2000,
      description: t('bronze-description'),
      motivationalMessage: t('bronze-motivation'),
      benefits: [t('bronze-benefit-1')]
    }
  ];

  // Calcul du niveau actuel et du prochain - Logique corrigée
  const getCurrentBadge = () => {
    if (emissions === 0) {
      return {
        current: null,
        next: badgeLevels[3], // Bronze
        progress: 0,
        isFirstTime: true
      };
    }

    // Platinium ≤ 100
    if (emissions <= 100) {
      return {
        current: badgeLevels[0], // Platinum
        next: null,
        progress: 100,
        isFirstTime: false
      };
    }

    // Or ≤ 500
    if (emissions <= 500) {
      const progressToPlatinum = Math.round(((500 - emissions) / (500 - 100)) * 100);
      return {
        current: badgeLevels[1], // Gold
        next: badgeLevels[0], // Platinum
        progress: progressToPlatinum,
        isFirstTime: false
      };
    }

    // Argent ≤ 1000
    if (emissions <= 1000) {
      const progressToGold = Math.round(((1000 - emissions) / (1000 - 500)) * 100);
      return {
        current: badgeLevels[2], // Silver
        next: badgeLevels[1], // Gold
        progress: progressToGold,
        isFirstTime: false
      };
    }

    // Bronze > 1000
    const maxForBronze = 2000;
    let progressToSilver = 0;
    if (emissions <= maxForBronze) {
      progressToSilver = Math.round(((maxForBronze - emissions) / (maxForBronze - 1000)) * 100);
    }

    return {
      current: badgeLevels[3], // Bronze
      next: badgeLevels[2], // Silver
      progress: progressToSilver,
      isFirstTime: false
    };
  };

  const { current, next, progress, isFirstTime } = getCurrentBadge();

  // Calcul des émissions à réduire pour le prochain niveau
  const getEmissionsToReduce = () => {
    if (!next) return 0;
    return Math.max(0, emissions - next.threshold);
  };

  const emissionsToReduce = getEmissionsToReduce();
  const reductionPercentage = next ? Math.round(((emissions - next.threshold) / emissions) * 100) : 0;

  return (
    <Grow in={showAnimation} timeout={600}>
      <Card
        sx={{
          background: current ? current.bgColor : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          boxShadow: theme.shadows[8],
          border: `2px solid ${current?.color || theme.palette.grey[300]}`,
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: current?.bgColor || 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            borderRadius: 3,
            zIndex: -1,
            opacity: 0.3,
            filter: 'blur(8px)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header avec badge actuel */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              {current ? (
                <Zoom in={showAnimation} timeout={800}>
                  <Avatar
                    sx={{
                      background: current.bgColor,
                      width: 60,
                      height: 60,
                      border: `3px solid ${alpha(current.color, 0.5)}`,
                      boxShadow: `0 0 20px ${alpha(current.color, 0.3)}`
                    }}
                  >
                    {React.cloneElement(current.icon, { sx: { fontSize: 28, color: current.color } })}
                  </Avatar>
                </Zoom>
              ) : (
                <Avatar
                  sx={{
                    background: theme.palette.grey[100],
                    width: 60,
                    height: 60,
                    border: `3px solid ${theme.palette.grey[300]}`
                  }}
                >
                  <Star sx={{ fontSize: 28, color: theme.palette.grey[500] }} />
                </Avatar>
              )}

              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: current?.color || theme.palette.text.primary }}>
                  {current ? current.name : t('start-journey')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isFirstTime ? t('complete-first-assessment') : current?.description}
                </Typography>
              </Box>
            </Box>

            {current && (
              <Chip
                label={`${emissions} tCO₂e`}
                sx={{
                  background: alpha(current.color, 0.1),
                  color: current.color,
                  fontWeight: 'bold',
                  border: `1px solid ${alpha(current.color, 0.3)}`
                }}
              />
            )}
          </Box>

          {/* Message motivationnel */}
          {current && (
            <Box
              mb={3}
              p={2}
              sx={{
                background: alpha(current.color, 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(current.color, 0.2)}`
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  color: current.color,
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)' // Ombre pour améliorer la lisibilité
                }}
              >
                {current.motivationalMessage}
              </Typography>
            </Box>
          )}

          {/* Progression vers le prochain niveau */}
          {next && (
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {t('next-goal')}: {next.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {React.cloneElement(next.icon, { sx: { fontSize: 20, color: next.color } })}
                  <Typography variant="caption" color="text.secondary">
                    {progress.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  background: alpha(theme.palette.grey[300], 0.3),
                  '& .MuiLinearProgress-bar': {
                    background: next.bgColor,
                    borderRadius: 6,
                    boxShadow: `0 0 10px ${alpha(next.color, 0.4)}`
                  }
                }}
              />

              {emissionsToReduce > 0 && (
                <Box
                  mt={2}
                  p={2}
                  sx={{
                    background: alpha(next.color, 0.08),
                    borderRadius: 2,
                    border: `1px solid ${alpha(next.color, 0.2)}`
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TrendingUp sx={{ color: next.color, fontSize: 20 }} />
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{
                        color: next.color,
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                      }}
                    >
                      {t('reduction-needed')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary, // Meilleur contraste
                      fontWeight: 500
                    }}
                  >
                    {t('reduce-emissions-by')} <strong style={{ color: next.color }}>{emissionsToReduce} tCO₂e</strong> (
                    {reductionPercentage}%) {t('to-unlock')} <strong style={{ color: next.color }}>{next.name}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Avantages du niveau actuel */}
          {current?.benefits && current.benefits.length > 0 && (
            <Box mb={3}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                mb={1}
                sx={{
                  color: current.color,
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {t('current-benefits')}:
              </Typography>
              {current.benefits.map((benefit, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Nature sx={{ fontSize: 16, color: current.color }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary, // Meilleur contraste
                      fontWeight: 500
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Call to action */}
          <Box display="flex" gap={2}>
            {onViewDetails && (
              <Button
                variant="contained"
                endIcon={<KeyboardArrowRight />}
                onClick={onViewDetails}
                sx={{
                  background: current
                    ? `linear-gradient(135deg, ${current.color} 0%, ${alpha(current.color, 0.8)} 100%)`
                    : theme.palette.primary.main,
                  color: '#ffffff', // Toujours blanc pour bon contraste
                  fontWeight: 'bold',
                  '&:hover': {
                    background: current
                      ? `linear-gradient(135deg, ${alpha(current.color, 0.9)} 0%, ${alpha(current.color, 0.7)} 100%)`
                      : theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {t('view-emissions-details')}
              </Button>
            )}

            {next && (
              <Tooltip title={t('tips-to-improve')}>
                <Button
                  variant="outlined"
                  startIcon={<LocalFireDepartment />}
                  sx={{
                    borderColor: next.color,
                    color: next.color,
                    '&:hover': {
                      background: alpha(next.color, 0.1),
                      borderColor: next.color
                    }
                  }}
                >
                  {t('get-tips')}
                </Button>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default BadgeGamification;
