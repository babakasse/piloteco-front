import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MentionsLegales: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Retour à l'accueil
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Mentions Légales
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Informations générales
          </Typography>

          <Typography paragraph>
            <strong>Nom de l'entreprise :</strong> PilotÉco
            <br />
            <strong>Forme juridique :</strong> [À compléter]
            <br />
            <strong>Capital social :</strong> [À compléter]
            <br />
            <strong>Adresse du siège social :</strong> [À compléter]
            <br />
            <strong>Téléphone :</strong> [À compléter]
            <br />
            <strong>Email :</strong> contact@piloteco.fr
            <br />
            <strong>Numéro SIRET :</strong> [À compléter]
            <br />
            <strong>Code APE :</strong> [À compléter]
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Directeur de la publication
          </Typography>
          <Typography paragraph>[Nom du directeur de publication à compléter]</Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Hébergement
          </Typography>
          <Typography paragraph>
            Ce site est hébergé par :<br />
            [Nom de l'hébergeur à compléter]
            <br />
            [Adresse de l'hébergeur à compléter]
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Propriété intellectuelle
          </Typography>
          <Typography paragraph>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations
            iconographiques et photographiques.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Limitation de responsabilité
          </Typography>
          <Typography paragraph>
            Les informations contenues sur ce site sont données à titre indicatif et sont susceptibles d'évoluer. Par ailleurs, les
            renseignements figurant sur le site ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées
            depuis leur mise en ligne.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Contact
          </Typography>
          <Typography paragraph>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l'adresse : contact@piloteco.fr
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default MentionsLegales;
