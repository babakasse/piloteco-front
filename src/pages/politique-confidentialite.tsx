import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PolitiqueConfidentialite: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Retour à l'accueil
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Politique de Confidentialité
          </Typography>

          <Typography paragraph>
            Chez PilotÉco, nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité
            explique comment nous collectons, utilisons et protégeons vos informations.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            1. Données collectées
          </Typography>
          <Typography paragraph>Nous collectons les types de données suivants :</Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Données d'identification (nom, prénom, email)</li>
            <li>Données d'entreprise (nom de l'entreprise, secteur d'activité)</li>
            <li>Données environnementales (consommations énergétiques, émissions)</li>
            <li>Données de connexion (adresse IP, cookies)</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            2. Finalités du traitement
          </Typography>
          <Typography paragraph>Vos données sont utilisées pour :</Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Fournir nos services de calcul d'empreinte carbone</li>
            <li>Gérer votre compte utilisateur</li>
            <li>Améliorer notre plateforme</li>
            <li>Vous envoyer des informations sur nos services (avec votre consentement)</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            3. Base légale
          </Typography>
          <Typography paragraph>Le traitement de vos données repose sur :</Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>L'exécution du contrat de service</li>
            <li>Votre consentement pour les communications marketing</li>
            <li>Notre intérêt légitime pour l'amélioration des services</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            4. Durée de conservation
          </Typography>
          <Typography paragraph>
            Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et
            conformément aux obligations légales applicables. En général :
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Données de compte : pendant la durée d'utilisation du service + 3 ans</li>
            <li>Données environnementales : 5 ans pour permettre le suivi dans le temps</li>
            <li>Données de connexion : 1 an maximum</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            5. Vos droits
          </Typography>
          <Typography paragraph>Conformément au RGPD, vous disposez des droits suivants :</Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
            <li>Droit de retirer votre consentement</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            6. Sécurité
          </Typography>
          <Typography paragraph>
            Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données contre :
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Les accès non autorisés</li>
            <li>La perte de données</li>
            <li>La divulgation accidentelle</li>
            <li>La modification ou destruction illégale</li>
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            7. Cookies
          </Typography>
          <Typography paragraph>
            Notre site utilise des cookies techniques nécessaires au bon fonctionnement de la plateforme. Vous pouvez configurer votre
            navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            8. Contact
          </Typography>
          <Typography paragraph>
            Pour exercer vos droits ou pour toute question relative à cette politique de confidentialité, contactez-nous à :
            privacy@piloteco.fr
          </Typography>

          <Typography paragraph>Vous pouvez également contacter la CNIL si vous estimez que vos droits ne sont pas respectés.</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PolitiqueConfidentialite;
