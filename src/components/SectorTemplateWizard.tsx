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

interface SectorTemplateWizardProps {
  assessmentId: string;
  onSuccess?: () => void;
}

const steps = ['Sélection du secteur', 'Personnalisation', 'Confirmation'];

export default function SectorTemplateWizard({ assessmentId, onSuccess }: SectorTemplateWizardProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedEmissions, setSelectedEmissions] = useState<{ [key: number]: boolean }>({});
  const [customQuantities, setCustomQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const total = quantity * factor.value;
    // Convert to tCO₂e if needed
    if (factor.unit.includes('kg')) {
      return total / 1000;
    }
    return total;
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

        await createEmission(assessmentId, {
          source: emission.source,
          category: emission.category,
          activityData: emission.quantity,
          emissionFactor: factor.value,
          scope:
            emission.source === 'Company Vehicles' || emission.source === 'Natural Gas'
              ? 1
              : emission.source === 'Grid Electricity'
                ? 2
                : 3,
          unit: factor.unit,
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
        return '🔴 Priorité haute';
      case 'medium':
        return '🟡 Priorité moyenne';
      case 'low':
        return '🟢 Priorité basse';
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
            <Typography variant="h6">Assistant Intelligent par Secteur</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            🎯 Générez automatiquement les émissions typiques de votre secteur d'activité !
          </Alert>

          <Button variant="contained" startIcon={<BusinessIcon />} onClick={handleOpen} size="large">
            🚀 Démarrer l'assistant
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
            Assistant Bilan Carbone par Secteur
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
                Quel est votre secteur d'activité ?
              </Typography>
              <TextField
                select
                fullWidth
                value={selectedSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                label="Secteur d'activité"
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
                  <Typography variant="body2">{currentTemplate.description}</Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Step 2: Customization */}
          {activeStep === 1 && currentTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personnalisez vos émissions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sélectionnez et ajustez les émissions pertinentes pour votre entreprise
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
                          <Typography variant="body2">{emission.description}</Typography>
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
                Récapitulatif
              </Typography>

              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📊 {getSelectedEmissionsList().length} émissions sélectionnées
                </Typography>
                <Typography variant="h5" color="primary">
                  Total estimé: {getTotalEstimatedEmissions().toFixed(2)} tCO₂e
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
                ⚠️ Ces valeurs sont des estimations basées sur des moyennes sectorielles. Ajustez-les selon vos données réelles.
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
          <Button onClick={handleClose}>Annuler</Button>

          {activeStep > 0 && <Button onClick={handleBack}>Retour</Button>}

          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" disabled={activeStep === 0 && !selectedSector}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleGenerate} variant="contained" disabled={loading || getSelectedEmissionsList().length === 0}>
              {loading ? 'Génération...' : '🎯 Générer les émissions'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
