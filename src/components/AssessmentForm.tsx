import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createAssessment, updateAssessment } from '../api/carbonAssessment';
import { useLanguage } from '../contexts/LanguageContext';

interface AssessmentFormProps {
  onSuccess?: (assessment: any) => void;
  assessment?: any; // Pour la modification
  isEdit?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSuccess, assessment, isEdit = false }) => {
  const [name, setName] = useState(assessment?.name || '');
  const [description, setDescription] = useState(assessment?.description || '');
  const [year, setYear] = useState(assessment?.year || new Date().getFullYear().toString());
  const [status, setStatus] = useState(assessment?.status || 'draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (assessment) {
      setName(assessment.name || '');
      setDescription(assessment.description || '');
      setYear(assessment.year || new Date().getFullYear().toString());
      setStatus(assessment.status || 'draft');
    }
  }, [assessment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const assessmentData = { name, description, year: parseInt(year), status };
      let result;

      if (isEdit && assessment?.id) {
        result = await updateAssessment(parseInt(assessment.id, 10), assessmentData);
      } else {
        result = await createAssessment(assessmentData);
      }

      setSuccess(true);

      // Callback personnalisé
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Comportement par défaut : redirection après succès
        setTimeout(() => {
          navigate(`/assessment/${result.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('assessment-creation-error'));
    } finally {
      setLoading(false);
    }
  };

  if (success && !onSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {isEdit ? t('assessment-updated-successfully') : t('assessment-created-successfully')}
        </Alert>
        <CircularProgress size={24} />
        <Box sx={{ mt: 1, color: 'text.secondary' }}>{t('redirecting-to-assessment')}</Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label={t('assessment-name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label={t('description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        placeholder={t('assessment-description-placeholder')}
      />

      <TextField
        label={t('year')}
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
        type="number"
        fullWidth
        variant="outlined"
        inputProps={{ min: 2000, max: new Date().getFullYear() + 5 }}
      />

      <FormControl fullWidth variant="outlined">
        <InputLabel>{t('status')}</InputLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} label={t('status')}>
          <MenuItem value="draft">{t('draft')}</MenuItem>
          <MenuItem value="published">{t('published')}</MenuItem>
        </Select>
      </FormControl>

      {error && <Alert severity="error">{error}</Alert>}

      {success && onSuccess && <Alert severity="success">{t('assessment-created-successfully')}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/assessment-list')} disabled={loading}>
          {t('cancel')}
        </Button>

        <Button type="submit" variant="contained" disabled={loading} startIcon={loading && <CircularProgress size={16} />}>
          {loading ? t('creating-assessment') : isEdit ? t('update-assessment') : t('create-assessment')}
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentForm;
