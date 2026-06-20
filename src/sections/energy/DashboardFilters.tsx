import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { EnergyFiltersType, ResourceCategory } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';

// ==============================|| ENERGY — DASHBOARD FILTERS ||============================== //

interface DashboardFiltersProps {
  filters: EnergyFiltersType;
  onChange: (filters: EnergyFiltersType) => void;
}

const RESOURCE_CATEGORIES: ResourceCategory[] = ['ELEC', 'GAS', 'WATER'];

const MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' }
];

const COUNTRIES = [
  { code: '', label: 'Tous les pays' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Espagne' },
  { code: 'PL', label: 'Pologne' },
  { code: 'PT', label: 'Portugal' },
  { code: 'RO', label: 'Roumanie' },
  { code: 'HU', label: 'Hongrie' },
  { code: 'CH', label: 'Suisse' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'UA', label: 'Ukraine' },
  { code: 'RU', label: 'Russie' },
  { code: 'CI', label: "Côte d'Ivoire" },
  { code: 'SN', label: 'Sénégal' },
  { code: 'PDG', label: 'Congo' }
];

// Années proposées dans la liste — de l'année en cours jusqu'à 5 ans en arrière
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR - i));

export default function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  const { t } = useLanguage();

  const currentMonthNum = filters.month.split('-')[1] ?? '01';

  // Draft local pour permettre la saisie partielle sans reset
  const [yearDraft, setYearDraft] = useState(String(filters.year));

  useEffect(() => {
    setYearDraft(String(filters.year));
  }, [filters.year]);

  function applyYear(raw: string) {
    const cleaned = raw.replace(/\D/g, '').slice(0, 4);
    const year = parseInt(cleaned, 10);
    if (cleaned.length === 4 && year >= 2000 && year <= 2100) {
      onChange({ ...filters, year, month: `${year}-${currentMonthNum}` });
    }
  }

  function handleResourceChange(event: SelectChangeEvent) {
    onChange({ ...filters, resourceCategory: event.target.value as ResourceCategory });
  }

  function handleMonthChange(event: SelectChangeEvent) {
    onChange({ ...filters, month: `${filters.year}-${event.target.value}` });
  }

  function handleCountryChange(event: SelectChangeEvent) {
    onChange({ ...filters, countryCode: event.target.value || undefined });
  }

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
      {/* Ressource */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>{t('energy-resource')}</InputLabel>
        <Select value={filters.resourceCategory} label={t('energy-resource')} onChange={handleResourceChange}>
          {RESOURCE_CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {t(`resource-${cat.toLowerCase()}` as any)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      {/* Année — liste + saisie libre */}
      <Autocomplete
        freeSolo
        size="small"
        options={YEAR_OPTIONS}
        value={yearDraft}
        onInputChange={(_event, newValue) => {
          const cleaned = newValue.replace(/\D/g, '').slice(0, 4);
          setYearDraft(cleaned);
          applyYear(cleaned);
        }}
        onChange={(_event, newValue) => {
          if (newValue) {
            setYearDraft(newValue);
            applyYear(newValue);
          }
        }}
        sx={{ width: 110 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('energy-year')}
            inputProps={{ ...params.inputProps, inputMode: 'numeric', maxLength: 4 }}
            onBlur={() => {
              const year = parseInt(yearDraft, 10);
              if (isNaN(year) || year < 2000 || year > 2100) {
                setYearDraft(String(filters.year));
              }
            }}
          />
        )}
      />

      {/* Mois */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>{t('energy-month')}</InputLabel>
        <Select value={currentMonthNum} label={t('energy-month')} onChange={handleMonthChange}>
          {MONTHS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      {/* Pays */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>{t('energy-country')}</InputLabel>
        <Select value={filters.countryCode ?? ''} label={t('energy-country')} onChange={handleCountryChange}>
          {COUNTRIES.map(({ code, label }) => (
            <MenuItem key={code} value={code}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Indicateur période active */}
      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontStyle: 'italic' }}>
        {t('energy-period-hint', { month: filters.month, year: String(filters.year) })}
      </Typography>
    </Stack>
  );
}
