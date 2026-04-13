import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sessions
export const createSession = async (name) => {
  const response = await api.post('/api/sessions', { name });
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get('/api/sessions');
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/api/sessions/${sessionId}`);
  return response.data;
};

export const getSessionMessages = async (sessionId) => {
  const response = await api.get(`/api/sessions/${sessionId}/messages`);
  return response.data;
};

// Chat
export const askQuestion = async (sessionId, question, useCache = true) => {
  const response = await api.post('/api/ask', {
    session_id: sessionId,
    question,
    use_cache: useCache,
  });
  return response.data;
};

// System
export const setAlpha = async (alpha) => {
  const response = await api.put(`/api/alpha/${alpha}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/stats');
  return response.data;
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Admin endpoints
export const adminUploadFiles = async (password, files) => {
  const formData = new FormData();
  formData.append('password', password);
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await axios.post(`${API_BASE_URL}/api/admin/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAdminDocuments = async (password) => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/documents`, {
    params: { password },
  });
  return response.data;
};

export const deleteAdminDocument = async (password, docName) => {
  const response = await axios.delete(`${API_BASE_URL}/api/admin/documents/${docName}`, {
    params: { password },
  });
  return response.data;
};