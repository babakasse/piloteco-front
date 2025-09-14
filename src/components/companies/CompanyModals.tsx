import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface Company {
  id: number;
  name: string;
  address?: string;
  sector?: string;
}

interface EditValues {
  name: string;
  address: string;
  sector: string;
}

interface CompanyModalsProps {
  // Edit Modal
  editOpen: boolean;
  selectedCompany: Company | null;
  editValues: EditValues;
  onEditClose: () => void;
  onEditChange: (e: any) => void;
  onEditSubmit: () => void;

  // Delete Modal
  deleteOpen: boolean;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;

  // Add Modal
  addOpen: boolean;
  newCompanyValues: EditValues;
  onAddClose: () => void;
  onNewCompanyChange: (e: any) => void;
  onAddSubmit: () => void;

  loading: boolean;
}

export default function CompanyModals({
  editOpen,
  selectedCompany,
  editValues,
  onEditClose,
  onEditChange,
  onEditSubmit,
  deleteOpen,
  onDeleteClose,
  onDeleteConfirm,
  addOpen,
  newCompanyValues,
  onAddClose,
  onNewCompanyChange,
  onAddSubmit,
  loading
}: CompanyModalsProps) {
  const { t } = useLanguage();

  const sectorOptions = [
    'agriculture',
    'manufacturing',
    'energy',
    'transport',
    'construction',
    'services',
    'technology',
    'finance',
    'healthcare',
    'education',
    'retail',
    'other'
  ];

  return (
    <>
      {/* Edit Company Modal */}
      <Dialog open={editOpen} onClose={onEditClose} sx={{ '& .MuiDialogContent-root': { pt: 2 } }}>
        <DialogTitle>{t('edit-company')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('company-name')}
            type="text"
            fullWidth
            variant="outlined"
            value={editValues.name}
            onChange={onEditChange}
          />
          <TextField
            margin="dense"
            name="address"
            label={t('address')}
            type="text"
            fullWidth
            variant="outlined"
            value={editValues.address}
            onChange={onEditChange}
          />
          <TextField
            margin="dense"
            name="sector"
            label={t('sector')}
            select
            fullWidth
            variant="outlined"
            value={editValues.sector}
            onChange={onEditChange}
          >
            {sectorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option as string}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onEditClose}>{t('cancel')}</Button>
          <Button onClick={onEditSubmit} disabled={loading}>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Company Modal */}
      <Dialog open={deleteOpen} onClose={onDeleteClose}>
        <DialogTitle>{t('delete-company')}</DialogTitle>
        <DialogContent>{t('delete-company-confirmation')}</DialogContent>
        <DialogActions>
          <Button onClick={onDeleteClose}>{t('cancel')}</Button>
          <Button onClick={onDeleteConfirm} color="error" disabled={loading}>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Company Modal */}
      <Dialog open={addOpen} onClose={onAddClose} sx={{ '& .MuiDialogContent-root': { pt: 2 } }}>
        <DialogTitle>{t('add-new-company')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('company-name')}
            type="text"
            fullWidth
            variant="outlined"
            value={newCompanyValues.name}
            onChange={onNewCompanyChange}
          />
          <TextField
            margin="dense"
            name="address"
            label={t('address')}
            type="text"
            fullWidth
            variant="outlined"
            value={newCompanyValues.address}
            onChange={onNewCompanyChange}
          />
          <TextField
            margin="dense"
            name="sector"
            label={t('sector')}
            select
            fullWidth
            variant="outlined"
            value={newCompanyValues.sector}
            onChange={onNewCompanyChange}
          >
            {sectorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option as string}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onAddClose}>{t('cancel')}</Button>
          <Button onClick={onAddSubmit} disabled={loading}>
            {t('add')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
