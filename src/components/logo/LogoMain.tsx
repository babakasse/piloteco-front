// material-ui
import { useTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import logoDark from 'assets/images/piloteco-logo-2.png';
import logo from 'assets/images/piloteco-logo-2.png';
import { ThemeMode } from 'config';


// ==============================|| LOGO ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <>
      <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="150" />
    </>
  );
}
