import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { createAssessment } from '../api/carbonAssessment';

interface AssessmentFormProps {
  onSuccess?: (assessment: any) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const assessment = await createAssessment({ name, description, year });
      if (onSuccess) onSuccess(assessment);
    } catch (err: any) {
      setError('Erreur lors de la création du bilan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nom du bilan"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        multiline
        rows={2}
      />
      <TextField
        label="Année"
        value={year}
        onChange={e => setYear(e.target.value)}
        required
        type="number"
      />
      {error && <Box color="error.main">{error}</Box>}
      <Button type="submit" variant="contained" disabled={loading}>
        Créer le bilan
      </Button>
    </Box>
  );
};

export default AssessmentForm;

