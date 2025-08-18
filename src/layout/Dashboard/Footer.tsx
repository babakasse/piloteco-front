import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">&copy; PILOTECO ♥ crafted by Baba Kassé</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        {/* <Link component={RouterLink} to="http://localhost:3000/dashboard" target="_blank" variant="caption" color="text.primary">
          Dashboard  
        </Link> */}
        <Link component={RouterLink} to="" target="_blank" variant="caption" color="text.primary">
          Documentation
        </Link>
        <Link component={RouterLink} to="" target="_blank" variant="caption" color="text.primary">
          Support
        </Link>
      </Stack>
    </Stack>
  );
}
