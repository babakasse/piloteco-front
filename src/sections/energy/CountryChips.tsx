import { useRef } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — COUNTRY CHIPS ||============================== //

interface CountryChipsProps {
  selected: string[];
  onChange: (codes: string[]) => void;
}

const COUNTRIES = [
  { code: 'FR', label: 'France' },
  { code: 'HU', label: 'Hungary' },
  { code: 'CI', label: 'Ivory C.' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'PL', label: 'Poland' },
  { code: 'PT', label: 'Portugal' },
  { code: 'RO', label: 'Romania' },
  { code: 'RU', label: 'Russia' },
  { code: 'SN', label: 'Senegal' },
  { code: 'ES', label: 'Spain' },
  { code: 'UA', label: 'Ukraine' }
];

const ALL_CODES = COUNTRIES.map((c) => c.code);

export default function CountryChips({ selected, onChange }: CountryChipsProps) {
  const { t } = useLanguage();
  // Keep a ref always pointing at the latest `selected` prop to avoid stale
  // closures when multiple chips are clicked in rapid succession.
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const allSelected = selected.length === ALL_CODES.length || selected.length === 0;

  function toggleAll() {
    onChange(allSelected ? [] : ALL_CODES);
  }

  function toggleCountry(code: string) {
    const current = selectedRef.current;
    if (current.includes(code)) {
      onChange(current.filter((c) => c !== code));
    } else {
      onChange([...current, code]);
    }
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
        {t('energy-country')}
      </Typography>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        <Chip
          label={t('energy-filter-all')}
          size="small"
          onClick={toggleAll}
          color={allSelected ? 'success' : 'default'}
          variant={allSelected ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600 }}
        />
        {COUNTRIES.map(({ code, label }) => {
          const active = selected.includes(code);
          return (
            <Chip
              key={code}
              label={label}
              size="small"
              onClick={() => toggleCountry(code)}
              color={active ? 'success' : 'default'}
              variant={active ? 'filled' : 'outlined'}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
