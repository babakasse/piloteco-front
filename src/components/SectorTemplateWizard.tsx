// src/components/SectorTemplateWizard.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAllSectors, getSectorTemplate, EmissionTemplate } from '../data/sectorTemplates';
import { getEmissionFactor } from '../data/emissionFactors';
import { createEmission } from '../api/carbonAssessment';
import { useLanguage } from '../contexts/LanguageContext';

interface SectorTemplateWizardProps {
  assessmentId: string;
  onSuccess?: () => void;
}

export default function SectorTemplateWizard({ assessmentId, onSuccess }: SectorTemplateWizardProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedEmissions, setSelectedEmissions] = useState<{ [key: number]: boolean }>({});
  const [customQuantities, setCustomQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [t('sector-selection'), t('customization'), t('confirmation')];

  // Function to translate emission descriptions
  const translateDescription = (description: string) => {
    const descriptionMap: { [key: string]: string } = {
      'Consommation électricité bureaux': t('office-electricity-consumption'),
      'Hébergement et stockage de données': t('data-hosting-storage'),
      'Déplacements commerciaux équipe': t('commercial-team-travel'),
      "Repas d'équipe et événements": t('team-meals-events'),
      'Véhicules de fonction': t('company-vehicles-desc'),
      'Chauffage et procédés industriels': t('heating-industrial-processes'),
      'Machines et éclairage usine': t('factory-machines-lighting'),
      'Livraisons et transport marchandises': t('deliveries-goods-transport'),
      'Déchets de production': t('production-waste'),
      'Déplacements commerciaux': t('commercial-travel'),
      'Éclairage et climatisation magasins': t('store-lighting-ac'),
      'Livraisons clients': t('customer-deliveries'),
      'Chauffage points de vente': t('store-heating'),
      'Emballages et déchets': t('packaging-waste'),
      'Déplacements professionnels': t('professional-travel')
    };

    return descriptionMap[description] || description;
  };

  // Function to translate sector descriptions
  const translateSectorDescription = (description: string) => {
    const sectorDescMap: { [key: string]: string } = {
      'Entreprise de services numériques': t('tech-company-desc'),
      'Entreprise de production industrielle': t('manufacturing-company-desc'),
      'Commerce de détail et distribution': t('retail-company-desc'),
      'Entreprise de services et conseil': t('services-company-desc'),
      'Restaurant et restauration': t('restaurant-company-desc')
    };

    return sectorDescMap[description] || description;
  };

  const sectorOptions = getAllSectors();
  const currentTemplate = selectedSector ? getSectorTemplate(selectedSector) : null;

  const handleOpen = () => {
    setOpen(true);
    setActiveStep(0);
    setSelectedSector('');
    setSelectedEmissions({});
    setCustomQuantities({});
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    setSelectedEmissions({});
    setCustomQuantities({});

    // Pre-select high priority emissions
    const template = getSectorTemplate(sector);
    if (template) {
      const preSelected: { [key: number]: boolean } = {};
      const preQuantities: { [key: number]: number } = {};

      template.emissions.forEach((emission, index) => {
        if (emission.priority === 'high') {
          preSelected[index] = true;
        }
        if (emission.estimatedQuantity) {
          preQuantities[index] = emission.estimatedQuantity;
        }
      });

      setSelectedEmissions(preSelected);
      setCustomQuantities(preQuantities);
    }
  };

  const handleEmissionToggle = (index: number) => {
    setSelectedEmissions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setCustomQuantities((prev) => ({
      ...prev,
      [index]: quantity
    }));
  };

  const calculateEmissionTotal = (emission: EmissionTemplate, quantity: number) => {
    const factor = getEmissionFactor(emission.source, emission.subcategory);
    if (!factor) return 0;

    let standardizedFactor = factor.value;
    // Conversion automatique vers tCO₂e si nécessaire
    if (factor.unit.includes('kg')) {
      standardizedFactor = factor.value / 1000;
    }

    const total = quantity * standardizedFactor;
    // Arrondir à 2 décimales
    return Math.round(total * 100) / 100;
  };

  const getActivityUnit = (emission: EmissionTemplate) => {
    const factor = getEmissionFactor(emission.source, emission.subcategory);
    if (!factor) return 'unité';

    // Extract the denominator from units like "tCO₂e/passager/km" -> "passager/km"
    const parts = factor.unit.split('/');
    if (parts.length > 1) {
      return parts.slice(1).join('/');
    }
    return 'unité';
  };

  const getActivityUnitExample = (emission: EmissionTemplate) => {
    const unit = getActivityUnit(emission);
    const estimatedQty = emission.estimatedQuantity || 100;

    // Customize examples based on the unit
    if (unit.includes('km')) return `${estimatedQty} km`;
    if (unit.includes('repas')) return `${estimatedQty} repas`;
    if (unit.includes('MWh')) return `${estimatedQty} MWh`;
    if (unit.includes('tonne')) return `${estimatedQty} tonnes`;
    if (unit.includes('heure')) return `${estimatedQty} heures`;
    if (unit.includes('GB')) return `${estimatedQty} GB`;

    return `${estimatedQty} ${unit}`;
  };

  const getSelectedEmissionsList = () => {
    if (!currentTemplate) return [];

    return currentTemplate.emissions
      .map((emission, index) => ({
        ...emission,
        index,
        selected: selectedEmissions[index],
        quantity: customQuantities[index] || emission.estimatedQuantity || 0
      }))
      .filter((em) => em.selected);
  };

  const getTotalEstimatedEmissions = () => {
    return getSelectedEmissionsList().reduce((total, em) => {
      return total + calculateEmissionTotal(em, em.quantity);
    }, 0);
  };

  const handleGenerate = async () => {
    if (!currentTemplate || !assessmentId) return;

    setLoading(true);
    setError(null);

    try {
      const emissionsToCreate = getSelectedEmissionsList();

      for (const emission of emissionsToCreate) {
        const factor = getEmissionFactor(emission.source, emission.subcategory);
        if (!factor) continue;

        // Standardisation du facteur d'émission en tCO₂e
        let standardizedFactor = factor.value;
        if (factor.unit.includes('kg')) {
          standardizedFactor = factor.value / 1000;
        }

        await createEmission(assessmentId, {
          source: emission.source,
          category: emission.category,
          activityData: emission.quantity,
          emissionFactor: standardizedFactor,
          scope:
            emission.source === 'Company Vehicles' || emission.source === 'Natural Gas'
              ? 1
              : emission.source === 'Grid Electricity'
                ? 2
                : 3,
          unit: 'tCO₂e', // Toujours standardisé en tCO₂e
          description: emission.description,
          amount: calculateEmissionTotal(emission, emission.quantity),
          factorSource: factor.source
        });
      }

      handleClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return `🔴 ${t('priority-high')}`;
      case 'medium':
        return `🟡 ${t('priority-medium')}`;
      case 'low':
        return `🟢 ${t('priority-low')}`;
      default:
        return priority;
    }
  };

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">{t('sector-wizard')}</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            🎯 {t('sector-wizard-info')}
          </Alert>

          <Button variant="contained" startIcon={<BusinessIcon />} onClick={handleOpen} size="large">
            🚀 {t('start-wizard')}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
            {t('sector-wizard')}
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Sector Selection */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('activity-sector')}
              </Typography>
              <TextField
                select
                fullWidth
                value={selectedSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                label={t('sector')}
                sx={{ mb: 2 }}
              >
                {sectorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {currentTemplate && (
                <Alert severity="success">
                  <Typography variant="subtitle2">{currentTemplate.name}</Typography>
                  <Typography variant="body2">{translateSectorDescription(currentTemplate.description)}</Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Step 2: Customization */}
          {activeStep === 1 && currentTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('customize-emissions')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('customize-description')}
              </Typography>

              <List>
                {currentTemplate.emissions.map((emission, index) => (
                  <ListItem key={index} divider>
                    <Checkbox checked={selectedEmissions[index] || false} onChange={() => handleEmissionToggle(index)} />
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {emission.source} - {emission.subcategory}
                          </Typography>
                          <Chip
                            label={getPriorityLabel(emission.priority)}
                            color={getPriorityColor(emission.priority) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">{translateDescription(emission.description)}</Typography>
                          {selectedEmissions[index] && (
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <TextField
                                type="number"
                                size="small"
                                label={`Quantité (${getActivityUnit(emission)})`}
                                value={customQuantities[index] || emission.estimatedQuantity || ''}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                sx={{ width: 200 }}
                                helperText={`Ex: ${getActivityUnitExample(emission)}`}
                              />
                              <Typography variant="caption" color="primary" fontWeight="bold">
                                ≈ {calculateEmissionTotal(emission, customQuantities[index] || emission.estimatedQuantity || 0).toFixed(2)}{' '}
                                tCO₂e
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Step 3: Confirmation */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('summary')}
              </Typography>

              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📊 {getSelectedEmissionsList().length} {t('emissions-selected')}
                </Typography>
                <Typography variant="h5" color="primary">
                  {t('estimated-total')}: {getTotalEstimatedEmissions().toFixed(2)} tCO₂e
                </Typography>
              </Paper>

              <List dense>
                {getSelectedEmissionsList().map((emission, index) => (
                  <ListItem key={index}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <ListItemText
                      primary={`${emission.source} - ${emission.subcategory}`}
                      secondary={`${emission.quantity} × facteur = ${calculateEmissionTotal(emission, emission.quantity).toFixed(3)} tCO₂e`}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="warning" sx={{ mt: 2 }}>
                ⚠️ {t('estimation-warning')}
              </Alert>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>

          {activeStep > 0 && <Button onClick={handleBack}>{t('back')}</Button>}

          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" disabled={activeStep === 0 && !selectedSector}>
              {t('next')}
            </Button>
          ) : (
            <Button onClick={handleGenerate} variant="contained" disabled={loading || getSelectedEmissionsList().length === 0}>
              {loading ? t('generating') : `🎯 ${t('generate-emissions')}`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
