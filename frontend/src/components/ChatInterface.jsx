import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  Source as SourceIcon,
} from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import Loader from './Loader';

const ChatInterface = ({
  session,
  messages,
  onSendMessage,
  loading,
  onToggleSidebar,
  sources,
  onRefreshSources,
}) => {
  const [input, setInput] = useState('');
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Safe date formatting
  const formatSessionDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!session) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Session Selected
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create a new session or select an existing one from the sidebar
        </Typography>
        <Button
          variant="outlined"
          startIcon={<MenuIcon />}
          onClick={onToggleSidebar}
          sx={{ mt: 2 }}
        >
          Open Sessions
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6">{session.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {session.message_count} messages • Created{' '}
              {formatSessionDate(session.created_at)}
            </Typography>
          </Box>
        </Box>
        
        {sources && sources.length > 0 && (
          <Button
            startIcon={<SourceIcon />}
            onClick={() => setShowSources(!showSources)}
            size="small"
          >
            Sources ({sources.length})
          </Button>
        )}
      </Paper>

      {/* Sources Panel */}
      <Collapse in={showSources && sources && sources.length > 0}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2">Retrieved Sources</Typography>
            <IconButton size="small" onClick={onRefreshSources}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            {sources.map((source, index) => (
              <Chip
                key={index}
                label={`${source.table} (p${source.page}) - Score: ${source.score.toFixed(3)}`}
                size="small"
                variant="outlined"
                title={source.text}
              />
            ))}
          </Box>
        </Paper>
      </Collapse>

      {/* Messages Area */}
      <Box flex={1} overflow="auto" p={2}>
        {messages.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Start a conversation
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ maxWidth: 400 }}>
              Ask questions about your documents. The system will retrieve relevant information
              and generate answers based on the content.
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.message}
                isBot={msg.role === 'assistant'}
                timestamp={msg.timestamp}
              />
            ))}
            {loading && (
              <Box display="flex" alignItems="center" gap={1} p={2}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary">
                  Retrieving and generating answer...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            multiline
            maxRows={4}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!input.trim() || loading}
            sx={{ alignSelf: 'flex-end' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatInterface;