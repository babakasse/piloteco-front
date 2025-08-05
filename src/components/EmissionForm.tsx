import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, MenuItem, Typography, CircularProgress, Paper, TextField } from '@mui/material';
import { createEmission, getAssessmentWithEmissions } from '../api/carbonAssessment';

const scopes = [
  { value: 1, label: 'Scope 1' },
  { value: 2, label: 'Scope 2' },
  { value: 3, label: 'Scope 3' }
];

const defaultEmission = {
  source: '',
  category: '',
  activityData: '',
  emissionFactor: '',
  scope: 1,
  unit: 'kgCO₂e',
  description: ''
};

const sourceOptions = [
  { value: 'Air Travel', label: 'Voyage aérien' },
  { value: 'Employee Meals', label: 'Repas employés' },
  { value: 'Natural Gas', label: 'Gaz naturel' },
  { value: 'Landfill Waste', label: 'Déchets' },
  { value: 'Company Vehicles', label: 'Véhicules société' },
  { value: 'Grid Electricity', label: 'Électricité' },
  { value: 'Cloud Services', label: 'Services cloud' },
  { value: 'Raw Materials', label: 'Matières premières' }
];

const categoryOptions = [
  { value: 'Business Travel', label: 'Déplacements professionnels' },
  { value: 'Food', label: 'Alimentation' },
  { value: 'Heating', label: 'Chauffage' },
  { value: 'Waste', label: 'Déchets' },
  { value: 'Transportation', label: 'Transport' },
  { value: 'Electricity', label: 'Électricité' },
  { value: 'Services', label: 'Services' },
  { value: 'Materials', label: 'Matériaux' }
];

export default function EmissionForm({ assessmentId, onSuccess }: { assessmentId: string | undefined; onSuccess?: () => void }) {
  const [emissions, setEmissions] = useState([{ ...defaultEmission }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;
    setAssessmentLoading(true);
    getAssessmentWithEmissions(assessmentId)
      .then((data) => setAssessment(data))
      .finally(() => setAssessmentLoading(false));
  }, [assessmentId]);

  const handleEmissionChange = (idx: number, field: string, value: any) => {
    setEmissions((emissions) => emissions.map((em, i) => (i === idx ? { ...em, [field]: value } : em)));
  };

  const addEmission = () => setEmissions([...emissions, { ...defaultEmission }]);
  const removeEmission = (idx: number) => setEmissions((emissions) => emissions.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const emissionsToSend = emissions
        .filter((em) => em.source && em.category && em.activityData && em.emissionFactor && em.scope && em.unit)
        .map((em) => ({
          ...em,
          activityData: parseFloat(em.activityData),
          emissionFactor: parseFloat(em.emissionFactor),
          amount: parseFloat(em.activityData) * parseFloat(em.emissionFactor) // Ajout du calcul automatique
        }));
      // Appel API pour chaque émission
      for (const emission of emissionsToSend) {
        await createEmission(assessmentId, emission);
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

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        {assessmentLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
            <CircularProgress size={24} />
          </Box>
        ) : assessment ? (
          <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f7f7f7' }}>
            <Typography variant="subtitle1" gutterBottom>
              Bilan sélectionné
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
            {assessment.status && (
              <Typography>
                <b>Statut :</b> {assessment.status}
              </Typography>
            )}
          </Paper>
        ) : (
          <Typography color="error">Aucun bilan trouvé</Typography>
        )}
        <Typography variant="h6" gutterBottom>
          Ajouter des émissions
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Box mt={1} />
          <Typography variant="subtitle1">Émissions</Typography>
          {emissions.map((em, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
              {/* ...champs émission inchangés... */}
              <Grid item xs={12} md={2}>
                <TextField
                  label="Source"
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
              <Grid item xs={12} md={2}>
                <TextField
                  label="Catégorie"
                  select
                  fullWidth
                  value={em.category}
                  onChange={(e) => handleEmissionChange(idx, 'category', e.target.value)}
                  required
                >
                  {categoryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Activité"
                  type="number"
                  fullWidth
                  value={em.activityData}
                  onChange={(e) => handleEmissionChange(idx, 'activityData', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <TextField
                  label="Facteur"
                  type="number"
                  fullWidth
                  value={em.emissionFactor}
                  onChange={(e) => handleEmissionChange(idx, 'emissionFactor', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <TextField label="Unité" fullWidth value={em.unit} onChange={(e) => handleEmissionChange(idx, 'unit', e.target.value)} />
              </Grid>
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
                      {scope.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Description"
                  fullWidth
                  value={em.description}
                  onChange={(e) => handleEmissionChange(idx, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <TextField
                  label="Montant (calculé)"
                  type="number"
                  fullWidth
                  value={em.activityData && em.emissionFactor ? parseFloat(em.activityData) * parseFloat(em.emissionFactor) : ''}
                  InputProps={{ readOnly: true }}
                  helperText="activityData × facteur"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button color="error" onClick={() => removeEmission(idx)} disabled={emissions.length === 1}>
                  Supprimer
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addEmission} sx={{ mt: 1 }}>
            Ajouter une émission
          </Button>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mt={2}>
              Émission(s) ajoutée(s) avec succès !
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Envoi...' : 'Ajouter les émissions'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
