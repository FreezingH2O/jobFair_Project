'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle,Snackbar,Alert} from '@mui/material';
import deletePosition from '@/libs/deletePosition';

type DeletePositionButtonProps = {
  pid: string;
};

export default function DeletePositionButton({ pid }: DeletePositionButtonProps) {
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

  const handleDeletePosition = async () => {
    setIsDeleting(true);
    try {
      await deletePosition(pid);
      setSnackbarMessage('Position deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Navigate back to positions page after a short delay
      setTimeout(() => {
        router.push('/position');
      }, 1500);
    } catch (error) {
      console.error('Error deleting position:', error);
      setSnackbarMessage('Failed to delete position');
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
          px: 12,
          '&:hover': {
            bgcolor: "#d01010",
          },
          width: { xs: '100%', md: '350px' }
        }}
        onClick={handleOpenConfirmDialog}
        disabled={isDeleting}
      >
        Delete Position
      </Button>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Position Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this position? This action cannot be undone.
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
            onClick={handleDeletePosition} 
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
