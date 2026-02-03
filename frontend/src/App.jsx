import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CssBaseline,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  createSession,
  getSessions,
  deleteSession,
  getSessionMessages,
  askQuestion,
  setAlpha,
  getStats,
  healthCheck,
} from './services/api';
import ChatInterface from './components/ChatInterface';
import SessionSidebar from './components/SessionSidebar';
import Loader from './components/Loader';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);

  // Check system health on startup
  useEffect(() => {
    checkHealth();
    loadSessions();
    loadStats();
  }, []);

  const checkHealth = async () => {
    const status = await healthCheck();
    setHealthStatus(status);
    if (status.status !== 'healthy') {
      setError('Backend service is not available. Please ensure the backend is running.');
    }
  };

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load sessions');
    }
  };

  const loadStats = async () => {
    try {
      const data = await getStats();
      setSystemStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleCreateSession = async (name) => {
    try {
      const data = await createSession(name);
      await loadSessions();
      
      // Auto-select the new session
      const newSession = sessions.find(s => s.session_id === data.session_id) || data;
      setActiveSession(newSession);
      setMessages([]);
      setSuccess('Session created successfully');
    } catch (err) {
      setError('Failed to create session');
    }
  };

  const handleSelectSession = async (session) => {
    setActiveSession(session);
    setLoading(true);
    try {
      const msgs = await getSessionMessages(session.session_id);
      setMessages(msgs);
      setCurrentSources([]);
    } catch (err) {
      setError('Failed to load session messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      await loadSessions();
      
      if (activeSession?.session_id === sessionId) {
        setActiveSession(null);
        setMessages([]);
        setCurrentSources([]);
      }
      
      setSuccess('Session deleted successfully');
    } catch (err) {
      setError('Failed to delete session');
    }
  };

  const handleSendMessage = async (message) => {
    if (!activeSession) return;
    
    setLoading(true);
    try {
      const response = await askQuestion(activeSession.session_id, message);
      
      // Refresh messages
      const msgs = await getSessionMessages(activeSession.session_id);
      setMessages(msgs);
      setCurrentSources(response.sources || []);
      
      // Update session list to reflect new message count
      await loadSessions();
      
      if (response.from_cache) {
        setSuccess('Answer retrieved from cache');
      }
    } catch (err) {
      setError('Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAlpha = async (alpha) => {
    try {
      await setAlpha(alpha);
      await loadStats();
      setSuccess(`Alpha set to ${alpha}`);
    } catch (err) {
      setError('Failed to update alpha setting');
    }
  };

  const handleRefreshSources = () => {
    // In a real implementation, you might want to re-retrieve sources
    // For now, just close and reopen
    setCurrentSources([...currentSources]);
  };

  if (!healthStatus) {
    return <Loader message="Checking system health..." />;
  }

  if (healthStatus.status !== 'healthy') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Backend service is unavailable. Please ensure:
          <ul>
            <li>Backend server is running (python backend/app.py)</li>
            <li>Ollama is installed and running</li>
            <li>chunks.db exists in the project root</li>
          </ul>
        </Alert>
        <Box textAlign="center">
          <Alert severity="info">
            Check the backend logs for more details
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" height="100vh">
        <SessionSidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
          onSetAlpha={handleSetAlpha}
          stats={systemStats}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <Box flex={1}>
          <ChatInterface
            session={activeSession}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sources={currentSources}
            onRefreshSources={handleRefreshSources}
          />
        </Box>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;