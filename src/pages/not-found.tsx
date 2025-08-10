import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" color="primary" sx={{ fontSize: '8rem', fontWeight: 'bold', mb: 2 }}>
            404
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Page non trouvée
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </Typography>

          <Button variant="contained" size="large" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ px: 4, py: 2 }}>
            Retour à l'accueil
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
