// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import logoDark from 'assets/images/piloteco-logo-2.png';
import logo from 'assets/images/piloteco-logo-2.png';

// ==============================|| LOGO MAIN ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <Box
      component="img"
      src={theme.palette.mode === 'dark' ? logoDark : logo}
      alt="Piloteco Logo"
      sx={{
        width: '100%',
        height: 'auto',
        maxWidth: { xs: 120, sm: 140, md: 150 },
        minWidth: { xs: 100, sm: 120, md: 120 }
      }}
    />
  );
}
