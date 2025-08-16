// src/components/SmartEmissionForm.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Tooltip,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { createEmission, getAssessmentWithEmissions } from '../api/carbonAssessment';
import { getFactorsBySource, getEmissionFactor } from '../data/emissionFactors';

const scopes = [
  { value: 1, label: 'Scope 1 - Direct' },
  { value: 2, label: 'Scope 2 - Électricité' },
  { value: 3, label: 'Scope 3 - Indirect' }
];

const defaultEmission = {
  source: '',
  category: '',
  subcategory: '',
  activityData: '',
  emissionFactor: '',
  scope: 1,
  unit: 'tCO₂e',
  description: '',
  factorSource: '',
  methodology: ''
};

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

const categoryOptions = [
  { value: 'Electricity', label: 'Électricité' },
  { value: 'Heating', label: 'Chauffage' },
  { value: 'Transportation', label: 'Transport' },
  { value: 'Business Travel', label: 'Déplacements professionnels' },
  { value: 'Waste', label: 'Déchets' },
  { value: 'Water', label: 'Eau' },
  { value: 'Materials', label: 'Matériaux' },
  { value: 'Food', label: 'Alimentation' },
  { value: 'Services', label: 'Services' },
  { value: 'Equipment', label: 'Équipements' }
];

export default function SmartEmissionForm({ assessmentId, onSuccess }: { assessmentId: string | undefined; onSuccess?: () => void }) {
  const [emissions, setEmissions] = useState([{ ...defaultEmission }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;
    setAssessmentLoading(true);
    getAssessmentWithEmissions(parseInt(assessmentId))
      .then((data) => setAssessment(data))
      .finally(() => setAssessmentLoading(false));
  }, [assessmentId]);

  const handleEmissionChange = (idx: number, field: string, value: any) => {
    setEmissions((emissions) =>
      emissions.map((em, i) => {
        if (i === idx) {
          const updatedEm = { ...em, [field]: value };

          // Auto-remplissage du facteur d'émission
          if (field === 'source' || field === 'subcategory') {
            if (updatedEm.source && updatedEm.subcategory) {
              const factor = getEmissionFactor(updatedEm.source, updatedEm.subcategory);
              if (factor) {
                // Conversion automatique vers tCO₂e si nécessaire
                if (factor.unit.includes('kg')) {
                  updatedEm.emissionFactor = (factor.value / 1000).toString();
                } else {
                  updatedEm.emissionFactor = factor.value.toString();
                }

                updatedEm.factorSource = factor.source;
                updatedEm.methodology = factor.methodology;
                updatedEm.unit = 'tCO₂e'; // Toujours standardisé en tCO₂e

                // Auto-sélection du scope basé sur la source
                if (updatedEm.source === 'Company Vehicles' || updatedEm.source === 'Natural Gas') {
                  updatedEm.scope = 1;
                } else if (updatedEm.source === 'Grid Electricity') {
                  updatedEm.scope = 2;
                } else {
                  updatedEm.scope = 3;
                }
              }
            }

            // Reset subcategory if source changes
            if (field === 'source') {
              updatedEm.subcategory = '';
              updatedEm.emissionFactor = '';
              updatedEm.factorSource = '';
              updatedEm.methodology = '';

              // Auto-sélection de la catégorie basée sur la source
              const sourceToCategory: { [key: string]: string } = {
                'Grid Electricity': 'Electricity',
                'Natural Gas': 'Heating',
                'Company Vehicles': 'Transportation',
                'Air Travel': 'Business Travel',
                'Landfill Waste': 'Waste',
                'Water Supply': 'Water',
                'Raw Materials': 'Materials',
                'Employee Meals': 'Food',
                'Cloud Services': 'Services',
                'IT Equipment': 'Equipment'
              };
              updatedEm.category = sourceToCategory[updatedEm.source] || '';
            }
          }

          return updatedEm;
        }
        return em;
      })
    );
  };

  const getSubcategories = (source: string) => {
    const factors = getFactorsBySource(source);
    if (!factors) return [];

    return Object.keys(factors).map((key) => ({
      value: key,
      label: key
    }));
  };

  const getActivityUnitFromSource = (source: string, subcategory: string) => {
    const factor = getEmissionFactor(source, subcategory);
    if (!factor) return 'Ex: 1000';

    // Extraire l'unité d'activité à partir de l'unité du facteur
    const parts = factor.unit.split('/');
    if (parts.length > 1) {
      const activityUnit = parts.slice(1).join('/');
      return `En ${activityUnit}`;
    }

    // Cas spéciaux pour les unités par unité
    if (factor.unit.includes('unité')) {
      return "En nombre d'unités";
    }

    return 'Ex: 1000';
  };

  const addEmission = () => setEmissions([...emissions, { ...defaultEmission }]);
  const removeEmission = (idx: number) => setEmissions((emissions) => emissions.filter((_, i) => i !== idx));

  const calculateTotal = (em: any) => {
    if (em.activityData && em.emissionFactor) {
      const result = parseFloat(em.activityData) * parseFloat(em.emissionFactor);
      // L'unité est toujours tCO₂e maintenant - 2 décimales
      return result.toFixed(2);
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const emissionsToSend = emissions
        .filter((em) => em.source && em.category && em.subcategory && em.activityData && em.emissionFactor)
        .map((em) => ({
          source: em.source,
          category: em.category,
          subcategory: em.subcategory,
          activityData: parseFloat(em.activityData),
          emissionFactor: parseFloat(em.emissionFactor),
          scope: em.scope,
          unit: em.unit,
          description: em.description || '',
          factorSource: em.factorSource || '',
          methodology: em.methodology || '',
          amount: parseFloat(calculateTotal(em)) || parseFloat(em.activityData) * parseFloat(em.emissionFactor)
        }));

      if (emissionsToSend.length === 0) {
        setError('Veuillez remplir au moins une émission complète (source, catégorie, type spécifique, quantité et facteur)');
        return;
      }

      for (const emission of emissionsToSend) {
        await createEmission(assessmentId!, emission);
      }

      setSuccess(true);
      setEmissions([{ ...defaultEmission }]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de l'ajout de l'émission");
    } finally {
      setLoading(false);
    }
  };

  if (assessmentLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        {/* Informations du bilan */}
        {assessment ? (
          <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f7f7f7' }}>
            <Typography variant="subtitle1" gutterBottom>
              📊 Bilan sélectionné
            </Typography>
            <Typography>
              <b>Nom :</b> {assessment.name}
            </Typography>
            <Typography>
              <b>Année :</b> {assessment.year}
            </Typography>
            <Typography>
              <b>Description :</b> {assessment.description || '-'}
            </Typography>
          </Paper>
        ) : (
          <Alert severity="error">Aucun bilan trouvé</Alert>
        )}

        {/* Titre avec icône */}
        <Box display="flex" alignItems="center" mb={2}>
          <AutoFixHighIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Ajouter des émissions (Facteurs automatiques)</Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          💡 Sélectionnez une source et un type spécifique : les facteurs d'émission seront automatiquement remplis !
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          {emissions.map((em, idx) => (
            <Paper key={idx} elevation={1} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Émission #{idx + 1}
              </Typography>

              <Grid container spacing={2} alignItems="center">
                {/* Source */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Source d'émission"
                    select
                    fullWidth
                    value={em.source}
                    onChange={(e) => handleEmissionChange(idx, 'source', e.target.value)}
                    required
                  >
                    {sourceOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Type spécifique (sous-catégorie) */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Type spécifique"
                    select
                    fullWidth
                    value={em.subcategory}
                    onChange={(e) => handleEmissionChange(idx, 'subcategory', e.target.value)}
                    disabled={!em.source}
                    helperText={em.source ? 'Facteur auto-calculé ✨' : "Sélectionnez d'abord une source"}
                    required
                  >
                    {getSubcategories(em.source).map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Catégorie */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Catégorie"
                    select
                    fullWidth
                    value={em.category}
                    onChange={(e) => handleEmissionChange(idx, 'category', e.target.value)}
                    helperText="Auto-sélectionnée"
                    InputProps={{
                      readOnly: true
                    }}
                    required
                  >
                    {categoryOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Quantité */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Quantité"
                    type="number"
                    fullWidth
                    value={em.activityData}
                    onChange={(e) => handleEmissionChange(idx, 'activityData', e.target.value)}
                    helperText={em.source && em.subcategory ? getActivityUnitFromSource(em.source, em.subcategory) : 'Ex: 1000'}
                    required
                  />
                </Grid>

                {/* Facteur d'émission */}
                <Grid item xs={12} md={2}>
                  <Tooltip title={em.methodology || "Facteur d'émission"}>
                    <TextField
                      label="Facteur"
                      type="number"
                      fullWidth
                      value={em.emissionFactor}
                      onChange={(e) => handleEmissionChange(idx, 'emissionFactor', e.target.value)}
                      InputProps={{
                        readOnly: !!em.factorSource,
                        endAdornment: em.factorSource && <InfoIcon color="primary" fontSize="small" />
                      }}
                      helperText={em.factorSource ? `Auto (${em.factorSource})` : 'Manuel'}
                      required
                    />
                  </Tooltip>
                </Grid>

                {/* Scope */}
                <Grid item xs={12} md={1}>
                  <TextField
                    label="Scope"
                    select
                    fullWidth
                    value={em.scope}
                    onChange={(e) => handleEmissionChange(idx, 'scope', Number(e.target.value))}
                  >
                    {scopes.map((scope) => (
                      <MenuItem key={scope.value} value={scope.value}>
                        {scope.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Actions */}
                <Grid item xs={12} md={1}>
                  <Button color="error" onClick={() => removeEmission(idx)} disabled={emissions.length === 1} size="small">
                    ❌
                  </Button>
                </Grid>

                {/* Résultat calculé */}
                {calculateTotal(em) && (
                  <Grid item xs={12}>
                    <Chip label={`= ${calculateTotal(em)} tCO₂e`} color="success" variant="outlined" size="small" />
                  </Grid>
                )}

                {/* Méthodologie */}
                {em.methodology && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      📋 {em.methodology}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))}

          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" onClick={addEmission}>
              ➕ Ajouter une émission
            </Button>

            <Button type="submit" variant="contained" disabled={loading} size="large">
              {loading ? 'Sauvegarde...' : `💾 Sauvegarder ${emissions.length} émission(s)`}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              ✅ Émission(s) ajoutée(s) avec succès !
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
