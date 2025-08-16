// src/components/BulkImportForm.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { createEmission } from '../api/carbonAssessment';
import { getEmissionFactor } from '../data/emissionFactors';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

interface ParsedEmission {
  source: string;
  subcategory: string;
  activityData: number;
  category: string;
  description: string;
  scope?: number;
  emissionFactor?: number;
  amount?: number;
  unit?: string;
  factorSource?: string;
  valid: boolean;
  errors: string[];
}

interface BulkImportFormProps {
  assessmentId: string;
  onSuccess?: () => void;
}

export default function BulkImportForm({ assessmentId, onSuccess }: BulkImportFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedEmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const templateCSV = `Source,Type spécifique,Quantité,Catégorie,Description
Air Travel,Court-courrier (<1000km),2000,Business Travel,Paris-Lyon (10 voyages)
Company Vehicles,Voiture essence,15000,Transportation,Véhicule commercial
Grid Electricity,France,120,Electricity,Consommation bureau principal
Employee Meals,Repas moyen,250,Food,Repas équipe (50 employés × 5 jours)`;

  const downloadTemplate = () => {
    const blob = new Blob([templateCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_emissions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string): ParsedEmission[] => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());

    // Validation des colonnes requises
    const requiredColumns = ['Source', 'Type spécifique', 'Quantité', 'Catégorie'];
    const missingColumns = requiredColumns.filter((col) => !headers.some((h) => h.toLowerCase().includes(col.toLowerCase())));

    if (missingColumns.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingColumns.join(', ')}`);
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map((v) => v.trim());
      const errors: string[] = [];

      const source = values[0] || '';
      const subcategory = values[1] || '';
      const activityDataStr = values[2] || '';
      const category = values[3] || '';
      const description = values[4] || '';

      // Validation des données
      if (!source) errors.push('Source manquante');
      if (!subcategory) errors.push('Type spécifique manquant');
      if (!activityDataStr || isNaN(Number(activityDataStr))) {
        errors.push('Quantité invalide');
      }
      if (!category) errors.push('Catégorie manquante');

      const activityData = Number(activityDataStr);

      // Récupération automatique du facteur d'émission
      const factor = getEmissionFactor(source, subcategory);
      let emissionFactor = 0;
      let unit = 'tCO₂e'; // Toujours standardisé en tCO₂e
      let factorSource = '';
      let scope = 3; // Par défaut Scope 3

      if (factor) {
        // Conversion automatique vers tCO₂e si nécessaire
        if (factor.unit.includes('kg')) {
          emissionFactor = factor.value / 1000;
        } else {
          emissionFactor = factor.value;
        }

        factorSource = factor.source;

        // Auto-détermination du scope
        if (source === 'Company Vehicles' || source === 'Natural Gas') {
          scope = 1;
        } else if (source === 'Grid Electricity') {
          scope = 2;
        }
      } else if (source && subcategory) {
        errors.push("Facteur d'émission non trouvé pour cette combinaison");
      }

      const amount = Math.round(activityData * emissionFactor * 100) / 100; // 2 décimales

      return {
        source,
        subcategory,
        activityData,
        category,
        description,
        scope,
        emissionFactor,
        amount,
        unit,
        factorSource,
        valid: errors.length === 0 && factor !== null,
        errors
      };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseCSV(content);
        setParsedData(parsed);
        setShowPreview(true);
      } catch (err: any) {
        setError(err.message);
        setParsedData([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!assessmentId || parsedData.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const validEmissions = parsedData.filter((em) => em.valid);

      if (validEmissions.length === 0) {
        throw new Error('Aucune émission valide à importer');
      }

      for (const emission of validEmissions) {
        await createEmission(assessmentId, {
          source: emission.source,
          category: emission.category,
          activityData: emission.activityData,
          emissionFactor: emission.emissionFactor,
          scope: emission.scope,
          unit: emission.unit,
          description: emission.description,
          amount: emission.amount,
          factorSource: emission.factorSource
        });
      }

      setShowPreview(false);
      setParsedData([]);
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  };

  const validCount = parsedData.filter((em) => em.valid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Import en masse CSV/Excel</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            📁 Importez plusieurs émissions d'un coup via un fichier CSV. Les facteurs d'émission seront automatiquement appliqués !
          </Alert>

          <Box display="flex" gap={2} mb={2}>
            <Button variant="outlined" onClick={downloadTemplate} startIcon={<CloudUploadIcon />}>
              📥 Télécharger le modèle CSV
            </Button>

            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              📤 Choisir un fichier CSV
              <VisuallyHiddenInput type="file" accept=".csv,.txt" onChange={handleFileChange} />
            </Button>
          </Box>

          {file && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Fichier sélectionné: {file.name} ({file.size} octets)
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              ❌ {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          📊 Prévisualisation de l'import
          <Box mt={1}>
            <Chip label={`${validCount} valides`} color="success" size="small" sx={{ mr: 1 }} />
            {invalidCount > 0 && <Chip label={`${invalidCount} erreurs`} color="error" size="small" />}
          </Box>
        </DialogTitle>

        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Statut</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Facteur</TableCell>
                  <TableCell>Total (tCO₂e)</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Erreurs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedData.map((em, index) => (
                  <TableRow key={index} sx={{ backgroundColor: em.valid ? '#f1f8e9' : '#ffebee' }}>
                    <TableCell>{em.valid ? '✅' : '❌'}</TableCell>
                    <TableCell>{em.source}</TableCell>
                    <TableCell>{em.subcategory}</TableCell>
                    <TableCell>{em.activityData}</TableCell>
                    <TableCell>
                      {em.emissionFactor ? (
                        <Tooltip title={em.factorSource}>
                          <span>{em.emissionFactor}</span>
                        </Tooltip>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <strong>{em.amount ? em.amount.toFixed(3) : '-'}</strong>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Scope ${em.scope}`}
                        color={em.scope === 1 ? 'success' : em.scope === 2 ? 'info' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {em.errors.map((error, i) => (
                        <Typography key={i} variant="caption" color="error" display="block">
                          {error}
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {validCount > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              🎯 {validCount} émissions seront importées avec succès
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Annuler</Button>
          <Button onClick={handleImport} variant="contained" disabled={loading || validCount === 0}>
            {loading ? 'Import...' : `Importer ${validCount} émissions`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
