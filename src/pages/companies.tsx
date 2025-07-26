import { Box, Typography, Divider, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import useCompany from 'hooks/useCompany';
import CompanyCard from 'components/cards/company/CompanyCard';
import { useState } from 'react';
import axios from 'utils/axios'; // Utilisation de l'instance axios personnalisée

export default function CompaniesPage() {
  const { companies, isAdmin, refreshCompanies } = useCompany();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [editValues, setEditValues] = useState({ name: '', address: '', sector: '' });
  const [loading, setLoading] = useState(false);

  const handleEditClick = (comp: any) => {
    setSelectedCompany(comp);
    setEditValues({ name: comp.name, address: comp.address, sector: comp.sector || '' });
    setEditOpen(true);
  };

  const handleEditChange = (e: any) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch(`/companies/${selectedCompany.id}`, editValues, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });
      setEditOpen(false);
      refreshCompanies && refreshCompanies();
    } catch (error) {
      console.error('Failed to update company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (comp: any) => {
    setSelectedCompany(comp);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`/companies/${selectedCompany.id}`);
      setDeleteOpen(false);
      refreshCompanies && refreshCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Liste des entreprises
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {companies && companies.length > 0 ? (
          companies.map((comp) => (
            <Grid item xs={12} sm={6} md={4} key={comp.id}>
              <CompanyCard
                company={comp}
                onEdit={() => handleEditClick(comp)}
                onDelete={() => handleDeleteClick(comp)}
                isAdmin={isAdmin}
              />
            </Grid>
          ))
        ) : (
          <Typography color="warning.main" mt={2}>
            Aucune entreprise trouvée.
          </Typography>
        )}
      </Grid>

      {/* Modale d'édition */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        sx={{ '& .MuiDialogContent-root': { pt: 2 } }}
      >
        <DialogTitle>Modifier l'entreprise</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="name"
            value={editValues.name}
            onChange={handleEditChange}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Adresse"
            name="address"
            value={editValues.address}
            onChange={handleEditChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Secteur"
            name="sector"
            value={editValues.sector}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Supprimer l'entreprise</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette entreprise ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
