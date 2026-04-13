import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WarningIcon from '@mui/icons-material/Warning';
import { adminUploadFiles, getAdminDocuments, deleteAdminDocument } from '../services/api';

const AdminPanel = ({ open, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);

  useEffect(() => {
    if (open && tabValue === 1 && password) {
      loadDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tabValue]);

  const loadDocuments = async () => {
    if (!password) return;
    setDocumentsLoading(true);
    try {
      const result = await getAdminDocuments(password);
      setDocuments(result.documents);
    } catch (err) {
      setError(`Failed to load documents: ${err.response?.data?.detail || err.message}`);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    // Filter for supported file types
    const supportedFiles = selectedFiles.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx', 'pptx'].includes(ext);
    });

    if (supportedFiles.length !== selectedFiles.length) {
      setError('Only PDF, DOCX, and PPTX files are supported.');
    } else {
      setError(null);
    }

    setFiles(supportedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await adminUploadFiles(password, files);
      
      setSuccess(
        `✅ Successfully processed ${result.files.length} file(s)! The documents are now in the knowledge base.`
      );
      
      // Reset form
      setFiles([]);
      
      // Reload documents list
      await loadDocuments();
      
      // Notify parent component
      if (onSuccess) {
        onSuccess(result);
      }

      // Close dialog after 2.5 seconds
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docName) => {
    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${docName}"? This cannot be undone.`)) {
      return;
    }

    setDeletingDoc(docName);
    try {
      await deleteAdminDocument(password, docName);
      setSuccess(`✅ Document "${docName}" deleted successfully`);
      await loadDocuments();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Failed to delete document: ${errorMessage}`);
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleClose = () => {
    if (!loading && !documentsLoading) {
      setPassword('');
      setFiles([]);
      setError(null);
      setSuccess(null);
      setTabValue(0);
      setDocuments([]);
      setDeletingDoc(null);
      onClose();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <CloudUploadIcon color="primary" />
          <Typography variant="h6">Admin Panel</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Admin Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          disabled={loading || documentsLoading}
          size="small"
          variant="outlined"
          placeholder="Enter admin password"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading || documentsLoading}
                size="small"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            ),
          }}
          inputProps={{
            autoComplete: 'off',
          }}
        />

        <Divider />

        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          disabled={loading || documentsLoading}
        >
          <Tab label="📤 Upload" />
          <Tab label="📋 Documents" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              component="label"
              sx={{
                border: '2px dashed #1976d2',
                borderRadius: 2,
                p: 2.5,
                textAlign: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: '#f5f5f5',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: loading ? '#f5f5f5' : '#e3f2fd',
                  borderColor: loading ? '#1976d2' : '#1565c0',
                },
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <input
                hidden
                accept=".pdf,.docx,.pptx"
                multiple
                type="file"
                onChange={handleFileSelect}
                disabled={loading}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2' }} />
              <Box sx={{ maxWidth: '100%' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#1976d2', 
                    fontWeight: 'bold',
                    wordWrap: 'break-word'
                  }}
                >
                  Click to select or drag files here
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#666',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  Supported: PDF, DOCX, PPTX
                </Typography>
              </Box>
            </Box>

            {files.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    📎 Selected Files ({files.length}):
                  </Typography>
                  {files.length > 0 && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setFiles([])}
                      disabled={loading}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>
                <List sx={{ maxHeight: 250, overflow: 'auto', bgcolor: '#fafafa', borderRadius: 1 }}>
                  {files.map((file, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.05)',
                          },
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            disabled={loading}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                          primaryTypographyProps={{ noWrap: true, title: file.name }}
                        />
                      </ListItem>
                      {index < files.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2 }}>
                <CircularProgress size={30} />
                <Typography variant="caption" color="textSecondary">
                  Processing documents...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!password ? (
              <Alert severity="info">
                Please enter your admin password above to view documents
              </Alert>
            ) : documentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : documents.length === 0 ? (
              <Alert severity="info">
                No documents uploaded yet
              </Alert>
            ) : (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  📚 Uploaded Documents ({documents.length}):
                </Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: '#fafafa', borderRadius: 1 }}>
                  {documents.map((doc, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.05)',
                          },
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteDocument(doc.name)}
                            disabled={deletingDoc === doc.name}
                            color="error"
                          >
                            {deletingDoc === doc.name ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={doc.name}
                          secondary={`${doc.chunks} chunks`}
                          primaryTypographyProps={{ noWrap: true, title: doc.name }}
                        />
                      </ListItem>
                      {index < documents.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2 }}>
                  Deleting documents cannot be undone. All chunks will be removed from the knowledge base.
                </Alert>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading || documentsLoading}
          variant="outlined"
        >
          Cancel
        </Button>
        {tabValue === 0 && (
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={loading || !password || files.length === 0}
            sx={{
              minWidth: 160,
            }}
          >
            {loading ? 'Processing...' : `Upload & Process (${files.length})`}
          </Button>
        )}
        {tabValue === 1 && (
          <Button
            onClick={loadDocuments}
            variant="outlined"
            disabled={!password || documentsLoading}
          >
            {documentsLoading ? 'Loading...' : 'Refresh'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanel;
