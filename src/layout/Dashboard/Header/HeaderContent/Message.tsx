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
import { useLanguage } from 'contexts/LanguageContext';

// assets
import { Add, NotificationStatus } from 'iconsax-react';

import message1 from 'assets/images/widget/message/message1.svg';
import message2 from 'assets/images/widget/message/message2.svg';
import message3 from 'assets/images/widget/message/message3.svg';
import message4 from 'assets/images/widget/message/message4.svg';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Customization() {
  const theme = useTheme();
  const { t } = useLanguage();

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
                  <Typography variant="h5">{t('piloteco-news')}</Typography>
                  <IconButton color="secondary" sx={{ p: 0 }} onClick={handleToggle}>
                    <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6">{t('today')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('new-feature-status'), color: 'success' }}
                      time={t('5-min-ago')}
                      title={t('scope-3-module-title')}
                      message={t('scope-3-announcement')}
                      src={message1}
                      actions={[
                        {
                          label: t('learn-more'),
                          button: { variant: 'outlined', color: 'secondary', fullWidth: true }
                        },
                        {
                          label: t('try-now'),
                          button: { variant: 'contained', fullWidth: true }
                        }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('maintenance-status'), color: 'warning' }}
                      time={t('30-min-ago')}
                      title={t('maintenance-title')}
                      message={t('maintenance-announcement')}
                      src={message2}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ my: 1.25 }}>
                    <Typography variant="h6">{t('yesterday')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('improvement-status'), color: 'primary' }}
                      time={t('1-day-ago')}
                      title={t('rse-indicators-title')}
                      message={t('rse-indicators-announcement')}
                      src={message3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('update-status'), color: 'info' }}
                      time={t('1-day-ago')}
                      title={t('pdf-export-title')}
                      message={t('pdf-export-announcement')}
                      src={message4}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ my: 1.25 }}>
                    <Typography variant="h6">{t('this-week')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('partnership-status'), color: 'secondary' }}
                      time={t('3-days-ago')}
                      title={t('ademe-partnership-title')}
                      message={t('ademe-partnership-announcement')}
                      src={message1}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: t('training-status'), color: 'info' }}
                      time={t('5-days-ago')}
                      title={t('webinar-title')}
                      message={t('webinar-announcement')}
                      src={message2}
                      actions={[
                        {
                          label: t('watch-replay'),
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
