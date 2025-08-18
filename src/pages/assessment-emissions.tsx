import React from 'react';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import EmissionForm from '../components/EmissionForm';

const AssessmentEmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MainCard title="Ajouter des émissions à ce bilan">
      <Typography variant="body1" gutterBottom>
        Remplissez le formulaire ci-dessous pour ajouter une émission à ce bilan carbone.
      </Typography>
      <EmissionForm assessmentId={id} />
    </MainCard>
  );
};

export default AssessmentEmissionsPage;

