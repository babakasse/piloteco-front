import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { SiteRankingItemType } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — SITE RANKING TABLE ||============================== //

interface SiteRankingTableProps {
  sites: SiteRankingItemType[];
  title: string;
  highlightColor?: 'success' | 'error';
}

export default function SiteRankingTable({ sites, title, highlightColor = 'success' }: SiteRankingTableProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  const accentColor = highlightColor === 'success' ? theme.palette.success.main : theme.palette.error.main;

  if (sites.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {t('energy-no-data')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1.5} sx={{ color: accentColor }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('energy-site-code')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('energy-country')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {t('energy-intensity')} (kWh/m²)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.siteUniqueCode} hover>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={site.rank <= 3 ? 700 : 400}
                    sx={{ color: site.rank <= 3 ? accentColor : 'inherit' }}
                  >
                    {site.rank}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {site.siteUniqueCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={site.countryCode} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {Number(site.intensity).toFixed(3)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
