// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import logoDark from 'assets/images/piloteco-logo-2.png';
import logo from 'assets/images/piloteco-logo-2.png';

// ==============================|| LOGO ICON ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <Box
      component="img"
      src={theme.palette.mode === 'dark' ? logoDark : logo}
      alt="Piloteco Logo"
      sx={{
        width: '100%',
        height: 'auto',
        maxWidth: { xs: 32, sm: 36, md: 40 },
        minWidth: { xs: 28, sm: 32, md: 32 }
      }}
    />
  );
}
