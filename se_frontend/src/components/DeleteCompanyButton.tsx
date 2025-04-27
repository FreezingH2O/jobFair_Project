'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import deleteCompany from '@/libs/deleteCompany';

type DeleteCompanyButtonProps = {
  companyId: string;
};

export default function DeleteCompanyButton({ companyId }: DeleteCompanyButtonProps) {
  const router = useRouter();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteCompany = async () => {
    setIsDeleting(true);
    try {
      await deleteCompany(companyId);
      setSnackbarMessage('Company deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Navigate back to companies page after a short delay
      setTimeout(() => {
        router.push('/company');
      }, 1500);
    } catch (error) {
      console.error('Error deleting company:', error);
      setSnackbarMessage('Failed to delete company');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsDeleting(false);
      setOpenConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#e82020",
          borderRadius: 3,
          fontSize: "1rem",
          py: 1,
          px: 2,
          '&:hover': {
            bgcolor: "#d01010",
          }
        }}
        onClick={handleOpenConfirmDialog}
        disabled={isDeleting}
      >
        Delete Company
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Company Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this company? This action cannot be undone and will remove all associated positions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseConfirmDialog} 
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCompany} 
            color="error" 
            variant="contained" 
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
