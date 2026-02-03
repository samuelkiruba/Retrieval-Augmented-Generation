import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const SessionSidebar = ({
  sessions,
  activeSession,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onSetAlpha,
  stats,
  open,
  onClose,
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [alphaValue, setAlphaValue] = useState(0.6);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Safe date formatting function
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // Format as "Jan 1, 2023"
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onCreateSession(newSessionName.trim());
      setNewSessionName('');
    }
  };

  const handleDeleteConfirm = (session) => {
    setDeleteConfirm(session);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      onDeleteSession(deleteConfirm.session_id);
      setDeleteConfirm(null);
    }
  };

  const handleAlphaChange = () => {
    if (alphaValue >= 0 && alphaValue <= 1) {
      onSetAlpha(alphaValue);
    }
  };

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            RAG Chat Sessions
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="New Session Name"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              sx={{ mb: 1 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSession}
              disabled={!newSessionName.trim()}
            >
              Create Session
            </Button>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setSettingsOpen(true)}
            >
              Settings
            </Button>
          </Box>

          {stats && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                System Stats
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                <Chip
                  label={`${stats.total_chunks} chunks`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Alpha: ${stats.alpha}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  label={`${stats.tables} documents`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <List>
            {sessions.map((session) => (
              <ListItem
                key={session.session_id}
                button
                selected={activeSession?.session_id === session.session_id}
                onClick={() => onSelectSession(session)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfirm(session);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText
                  primary={session.name}
                  secondary={`${session.message_count} messages • ${formatDate(session.created_at)}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Retrieval Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Alpha controls the balance between semantic (FAISS) and keyword (BM25) search:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              • Alpha = 1.0: Pure semantic search
              <br />
              • Alpha = 0.0: Pure keyword search
              <br />
              • Alpha = 0.6: Balanced (recommended)
            </Typography>
            
            <TextField
              fullWidth
              type="number"
              label="Alpha Value (0.0 - 1.0)"
              value={alphaValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setAlphaValue(Math.max(0, Math.min(1, val)));
                }
              }}
              inputProps={{ min: 0, max: 1, step: 0.1 }}
              sx={{ mb: 2 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                handleAlphaChange();
                setSettingsOpen(false);
              }}
            >
              Apply Alpha Setting
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Session</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete session "{deleteConfirm?.name}"?
            This will delete all messages in this session.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionSidebar;