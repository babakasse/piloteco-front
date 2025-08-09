import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import MessageCard from 'components/cards/statistics/MessageCard';
import { ThemeMode } from 'config';

// assets
import { Add, NotificationStatus } from 'iconsax-react';

import message1 from 'assets/images/widget/message/message1.svg';
import message2 from 'assets/images/widget/message/message2.svg';
import message3 from 'assets/images/widget/message/message3.svg';
import message4 from 'assets/images/widget/message/message4.svg';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Customization() {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.paper' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          onClick={handleToggle}
          aria-label="settings toggler"
          size="large"
          sx={{ color: 'secondary.main', bgcolor: open ? iconBackColorOpen : iconBackColor, p: 1 }}
        >
          <NotificationStatus variant="Bulk" />
        </IconButton>
      </Box>
      <Drawer sx={{ zIndex: 2001 }} anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: { xs: 350, sm: 474 } } }}>
        {open && (
          <MainCard content={false} sx={{ border: 'none', borderRadius: 0, height: '100vh' }}>
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                  <Typography variant="h5">Nouveautés PilotEco</Typography>
                  <IconButton color="secondary" sx={{ p: 0 }} onClick={handleToggle}>
                    <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Aujourd'hui</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Nouvelle fonctionnalité', color: 'success' }}
                      time="il y a 5 min"
                      title="Nouveau module Scope 3"
                      message="Découvrez notre nouvelle fonctionnalité pour calculer automatiquement vos émissions Scope 3. Intégration complète avec vos données fournisseurs."
                      src={message1}
                      actions={[
                        {
                          label: 'En savoir plus',
                          button: { variant: 'outlined', color: 'secondary', fullWidth: true }
                        },
                        {
                          label: 'Essayer maintenant',
                          button: { variant: 'contained', fullWidth: true }
                        }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Maintenance', color: 'warning' }}
                      time="il y a 30 min"
                      title="Maintenance programmée ce soir"
                      message="Une maintenance de 2h est prévue ce soir de 22h à 00h pour améliorer les performances de calcul des bilans carbone."
                      src={message2}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ my: 1.25 }}>
                    <Typography variant="h6">Hier</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Amélioration', color: 'primary' }}
                      time="il y a 1 jour"
                      title="Nouveaux indicateurs RSE"
                      message="Nous avons ajouté de nouveaux indicateurs de performance environnementale conformes aux standards GRI et CSRD."
                      src={message3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Mise à jour', color: 'info' }}
                      time="il y a 1 jour"
                      title="Export PDF amélioré"
                      message="Les rapports d'évaluation carbone sont maintenant exportables en PDF avec graphiques interactifs et données détaillées."
                      src={message4}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ my: 1.25 }}>
                    <Typography variant="h6">Cette semaine</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Partenariat', color: 'secondary' }}
                      time="il y a 3 jours"
                      title="Nouveau partenaire : ADEME"
                      message="PilotEco s'associe avec l'ADEME pour vous proposer les derniers facteurs d'émissions français mis à jour."
                      src={message1}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Formation', color: 'info' }}
                      time="il y a 5 jours"
                      title="Webinaire Bilan Carbone"
                      message="Replay disponible : 'Comment réaliser son premier bilan carbone avec PilotEco'. Durée : 45 minutes."
                      src={message2}
                      actions={[
                        {
                          label: 'Voir le replay',
                          button: { variant: 'contained', color: 'primary', fullWidth: true }
                        }
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
}
