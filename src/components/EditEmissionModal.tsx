import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { updateEmission } from '../api/carbonAssessment';
import { getFactorsBySource, getEmissionFactor } from '../data/emissionFactors';
import { useLanguage } from '../contexts/LanguageContext';

interface EditEmissionModalProps {
  open: boolean;
  onClose: () => void;
  emission: any;
  onSuccess: () => void;
}

const scopes = [
  { value: 1, label: 'Scope 1' },
  { value: 2, label: 'Scope 2' },
  { value: 3, label: 'Scope 3' }
];

const sourceOptions = [
  { value: 'Grid Electricity', label: '⚡ Électricité réseau' },
  { value: 'Natural Gas', label: '🔥 Gaz naturel' },
  { value: 'Company Vehicles', label: '🚗 Véhicules société' },
  { value: 'Air Travel', label: '✈️ Voyage aérien' },
  { value: 'Landfill Waste', label: '🗑️ Déchets' },
  { value: 'Water Supply', label: '💧 Approvisionnement eau' },
  { value: 'Raw Materials', label: '🏗️ Matières premières' },
  { value: 'Employee Meals', label: '🍽️ Repas employés' },
  { value: 'Cloud Services', label: '☁️ Services cloud' },
  { value: 'IT Equipment', label: '💻 Équipements IT' }
];

const EditEmissionModal: React.FC<EditEmissionModalProps> = ({ open, onClose, emission, onSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le formulaire avec les données de l'émission
  useEffect(() => {
    if (emission && open) {
      setFormData({
        source: emission.source || '',
        category: emission.category || '',
        subcategory: emission.subcategory || '',
        activityData: emission.activityData || emission.amount || '',
        emissionFactor: emission.emissionFactor || '',
        scope: emission.scope || 1,
        unit: emission.unit || 'tCO₂e',
        description: emission.description || '',
        factorSource: emission.factorSource || '',
        methodology: emission.methodology || ''
      });
      setError(null);
    }
  }, [emission, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };

      // Auto-remplissage du facteur d'émission quand source + sous-catégorie sont sélectionnées
      if (field === 'source' || field === 'subcategory') {
        if (updated.source && updated.subcategory) {
          const factor = getEmissionFactor(updated.source, updated.subcategory);
          if (factor) {
            updated.emissionFactor = factor.value.toString();
            updated.factorSource = factor.source;
            updated.methodology = factor.methodology;
            updated.unit = factor.unit;
          }
        }
      }

      return updated;
    });
  };

  // Fonction pour obtenir les sous-catégories basées sur la source
  const getSubcategories = (source: string) => {
    const factors = getFactorsBySource(source);
    if (!factors) return [];

    return Object.keys(factors).map((key) => ({
      value: key,
      label: key
    }));
  };

  const handleSubmit = async () => {
    if (!formData.source || !formData.activityData || !formData.emissionFactor) {
      setError(t('please-fill-required-fields'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculer les émissions
      const calculatedEmissions = (parseFloat(formData.activityData) * parseFloat(formData.emissionFactor)).toFixed(2);

      const emissionData = {
        source: formData.source,
        category: formData.category,
        subcategory: formData.subcategory,
        amount: parseFloat(formData.activityData),
        activityData: parseFloat(formData.activityData),
        emissionFactor: parseFloat(formData.emissionFactor),
        scope: formData.scope,
        unit: formData.unit,
        description: formData.description,
        factorSource: formData.factorSource,
        methodology: formData.methodology,
        calculatedEmissions: parseFloat(calculatedEmissions)
      };

      await updateEmission(emission.id, emissionData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('error-updating-emission'));
    } finally {
      setLoading(false);
    }
  };

  const calculatedEmissions =
    formData.activityData && formData.emissionFactor
      ? (parseFloat(formData.activityData) * parseFloat(formData.emissionFactor)).toFixed(2)
      : '0';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {t('edit-emission')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Source */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t('source')}
              value={formData.source || ''}
              onChange={(e) => handleChange('source', e.target.value)}
              required
            >
              {sourceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Catégorie */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('category')}
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </Grid>

          {/* Sous-catégorie */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t('subcategory')}
              value={formData.subcategory || ''}
              onChange={(e) => handleChange('subcategory', e.target.value)}
              disabled={!formData.source}
            >
              {getSubcategories(formData.source).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Scope */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t('scope')}
              value={formData.scope || 1}
              onChange={(e) => handleChange('scope', parseInt(e.target.value))}
              required
            >
              {scopes.map((scope) => (
                <MenuItem key={scope.value} value={scope.value}>
                  {scope.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Données d'activité */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label={t('activity-data')}
              value={formData.activityData || ''}
              onChange={(e) => handleChange('activityData', e.target.value)}
              required
              inputProps={{ step: 0.01, min: 0 }}
            />
          </Grid>

          {/* Facteur d'émission */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                type="number"
                label={t('emission-factor')}
                value={formData.emissionFactor || ''}
                onChange={(e) => handleChange('emissionFactor', e.target.value)}
                required
                inputProps={{ step: 0.001, min: 0 }}
              />
              {formData.factorSource && (
                <Tooltip title={`Source: ${formData.factorSource}`}>
                  <InfoIcon color="info" />
                </Tooltip>
              )}
            </Box>
          </Grid>

          {/* Unité */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={t('unit')} value={formData.unit || ''} onChange={(e) => handleChange('unit', e.target.value)} />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={t('description')}
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* Émissions calculées */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle2" color="primary">
                {t('calculated-emissions')}:
              </Typography>
              <Chip label={`${calculatedEmissions} tCO₂e`} color="primary" variant="outlined" />
            </Box>
          </Grid>

          {/* Méthodologie */}
          {formData.methodology && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                <strong>{t('methodology')}:</strong> {formData.methodology}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.source || !formData.activityData || !formData.emissionFactor}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? t('updating') : t('update-emission')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmissionModal;
