import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { EnergyFiltersType, ResourceCategory, ComparableFilter, DataSourceFilter } from 'types/energy';
import { useLanguage } from 'contexts/LanguageContext';
import type { TranslationKeys } from 'locales';

// ==============================|| ENERGY — DASHBOARD FILTERS ||============================== //

interface DashboardFiltersProps {
  filters: EnergyFiltersType;
  onChange: (filters: EnergyFiltersType) => void;
}

const RESOURCE_CATEGORIES: ResourceCategory[] = ['ELEC', 'GAS', 'WATER'];

const RESOURCE_TRANSLATION_KEYS: Record<ResourceCategory, TranslationKeys> = {
  ELEC: 'resource-elec',
  GAS: 'resource-gas',
  WATER: 'resource-water',
};

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

const SUB_CATEGORIES: Record<ResourceCategory, string[]> = {
  ELEC: [
    'Default retail not supported by EACs',
    'Default retail supported by EACs',
    'Off-site Physical PPA',
    'Project specific contract',
    'Off-site Financial PPA',
    'Lease & operation (as if self-consumption)',
    'Self-consumption (owned & operated)',
    'On-site PPA',
    'Off-site Direct PPA',
    'Unbundled EACs',
    'Retail Green Electricity',
    'Self-consumption (owned)',
  ],
  GAS: ['NG', 'HN'],
  WATER: ['CONSUMED', 'WATER', 'STORED'],
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR - i));

export default function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  const { t } = useLanguage();

  const currentMonthNum = filters.month.split('-')[1] ?? '01';
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

  // ── Resource multi-select (toggle chips) ──────────────────────────────────

  const activeCategories: ResourceCategory[] = filters.resourceCategories ?? [filters.resourceCategory];

  function handleResourceToggle(_: React.MouseEvent, values: ResourceCategory[]) {
    if (values.length === 0) return; // at least one must remain
    const primary = values[0];
    const newSubOptions = [...new Set(values.flatMap((cat) => SUB_CATEGORIES[cat]))];
    const keepSubCategories = (filters.resourceSubCategories ?? []).filter((s) => newSubOptions.includes(s));
    onChange({
      ...filters,
      resourceCategory: primary,
      resourceCategories: values.length > 1 ? values : undefined,
      resourceSubCategories: keepSubCategories.length > 0 ? keepSubCategories : undefined,
    });
  }

  // ── Sub-category (union of all selected resources) ───────────────────────

  const subCategoryOptions = [...new Set(activeCategories.flatMap((cat) => SUB_CATEGORIES[cat]))];

  function handleSubCategoryChange(event: SelectChangeEvent<string[]>) {
    const values = typeof event.target.value === 'string'
      ? event.target.value.split(',')
      : event.target.value;
    const filtered = values.filter((v) => v !== '');
    onChange({ ...filters, resourceSubCategories: filtered.length > 0 ? filtered : undefined });
  }

  // ── Month ─────────────────────────────────────────────────────────────────

  function handleMonthChange(event: SelectChangeEvent) {
    onChange({ ...filters, month: `${filters.year}-${event.target.value}` });
  }

  // ── Comparable ────────────────────────────────────────────────────────────

  function handleComparableChange(_: React.MouseEvent, value: ComparableFilter | null) {
    if (!value) return;
    onChange({ ...filters, comparable: value === 'all' ? undefined : value });
  }

  // ── Data source ───────────────────────────────────────────────────────────

  function handleDataSourceChange(_: React.MouseEvent, value: DataSourceFilter | null) {
    if (!value) return;
    onChange({ ...filters, dataSource: value === 'total' ? undefined : value });
  }

  return (
    <Stack spacing={1.5}>
      {/* Row 1: période → ressources → sous-catégorie */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
        {/* Année */}
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

        {/* Ressources (multi-toggle) */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {t('energy-resource')}
          </Typography>
          <ToggleButtonGroup
            value={activeCategories}
            onChange={handleResourceToggle}
            size="small"
            color="primary"
          >
            {RESOURCE_CATEGORIES.map((cat) => (
              <ToggleButton key={cat} value={cat} sx={{ px: 1.5, textTransform: 'none' }}>
                {t(RESOURCE_TRANSLATION_KEYS[cat])}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* Sous-catégorie — union des ressources sélectionnées */}
        <>
          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>{t('energy-sub-category')}</InputLabel>
            <Select<string[]>
              multiple
              value={filters.resourceSubCategories ?? []}
              label={t('energy-sub-category')}
              onChange={handleSubCategoryChange}
              renderValue={(selected) =>
                selected.length === 0
                  ? <em>{t('energy-all-sub-categories')}</em>
                  : selected.length === 1
                    ? selected[0]
                    : `${selected.length} sélectionnées`
              }
            >
              {subCategoryOptions.map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      </Stack>

      {/* Row 2: comparable + data source */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
        {/* Comparable */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {t('energy-filter-site')}
          </Typography>
          <ToggleButtonGroup
            value={filters.comparable ?? 'all'}
            exclusive
            onChange={handleComparableChange}
            size="small"
          >
            <ToggleButton value="all" sx={{ px: 1.5, textTransform: 'none' }}>
              {t('energy-filter-all')}
            </ToggleButton>
            <ToggleButton value="comparable" sx={{ px: 1.5, textTransform: 'none' }}>
              {t('energy-filter-comparable')}
            </ToggleButton>
            <ToggleButton value="non-comparable" sx={{ px: 1.5, textTransform: 'none' }}>
              {t('energy-filter-non-comparable')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

        {/* Source de données */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {t('energy-filter-data-source')}
          </Typography>
          <ToggleButtonGroup
            value={filters.dataSource ?? 'total'}
            exclusive
            onChange={handleDataSourceChange}
            size="small"
          >
            <ToggleButton value="total" sx={{ px: 1.5, textTransform: 'none' }}>
              {t('energy-filter-total')}
            </ToggleButton>
            <ToggleButton value="real" sx={{ px: 1.5, textTransform: 'none' }}>
              {t('energy-filter-real')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Stack>
  );
}
