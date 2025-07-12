// material-ui
import { useTheme } from '@mui/material/styles';
import logoDark from 'assets/images/piloteco-logo-2.png';
import logo from 'assets/images/piloteco-logo-2.png';

// ==============================|| LOGO ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <>
      <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="icon logo" width="150" />
    </>
  );
}
