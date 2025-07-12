// src/components/cards/company/CompanyCard.tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Edit } from 'iconsax-react';
import { useState } from 'react';
import useCompany from 'hooks/useCompany';
import axios from 'utils/axios';

interface Props {
  company: {
    name: string;
    address: string;
    sector: string;
  };
}

interface Company {
  id: number;
  name: string;
  address: string;
  sector: string;
}

export default function CompanyCard({ company }: Props) {
  const { user, companies, setCompanies } = useCompany();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    sector: ''
  });
  const [loading, setLoading] = useState(false);
  
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      address: company.address,
      sector: company.sector
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setFormData({ name: '', address: '', sector: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!editingCompany) return;

    setLoading(true);
    try {
      const response = await axios.patch(`/companies/${editingCompany.id}`, formData, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });
      console.log('Company updated:', response.data);

      // Mettre à jour la liste des entreprises
      if (setCompanies) {
        setCompanies((prevCompanies: Company[]) => 
          prevCompanies.map((comp: Company) => 
            comp.id === editingCompany.id 
              ? { ...comp, ...formData }
              : comp
          )
        );
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Failed to update company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6">{company.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Sector:</b> {company.sector}
            <br />
            <b>Address:</b> {company.address} 
            <br />
          </Typography>
        </CardContent>
      </Card>

      {isAdmin && companies.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Liste des entreprises (Administrateur)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {companies.map((comp) => (
              <Grid item xs={12} sm={6} md={4} key={comp.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {comp.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(comp)}
                        sx={{ ml: 1 }}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <b>Secteur:</b> {comp.sector}
                      <br />
                      <b>Adresse:</b> {comp.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Modal d'édition */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Modifier l'entreprise: {editingCompany?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nom de l'entreprise"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <TextField
              fullWidth
              label="Secteur"
              value={formData.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
            />
            <TextField
              fullWidth
              label="Adresse"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
