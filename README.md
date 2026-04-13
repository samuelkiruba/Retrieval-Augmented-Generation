# Retrieval-Augmented-Generation (RAG) Chatbot

![RAG Architecture](https://img.shields.io/badge/RAG-Chatbot-blue?style=flat-square) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat-square) ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

**Retrieval-Augmented-Generation (RAG) Chatbot** is a comprehensive document intelligence platform that transforms static files into interactive knowledge bases through advanced RAG technology. This full-stack application enables natural language question-answering across PDF, DOCX, and PPTX documents by combining semantic search (FAISS vector embeddings) with keyword matching (BM25) to intelligently retrieve relevant content and synthesize comprehensive answers using local LLMs via Ollama.

### Key Capabilities

- 📄 **Multi-Format Support**: PDF, DOCX, PPTX document processing
- 🔍 **Hybrid Search**: Combines FAISS semantic search with BM25 keyword matching
- 💬 **Natural Language QA**: Ask questions about documents in plain English
- 🧠 **Local LLM Integration**: Uses Ollama for private, on-premise LLM inference
- 📊 **Smart Chunking**: Semantic chunking based on sentence similarity (90% threshold)
- 🔐 **Admin Upload Panel**: Password-protected document upload interface
- 💾 **Session Management**: Persistent chat conversations with message history
- ⚡ **Query Caching**: Optimized responses with intelligent caching
- 🎨 **Modern UI**: React-based responsive interface with Material-UI
- 📝 **Rich Formatting**: Markdown-formatted responses with tables and formatting

---

## Project Structure

```
Retrieval-Augmented-Generation/
├── backend/                          # FastAPI Python backend
│   ├── app.py                        # Main FastAPI application
│   ├── config.py                     # Configuration settings
│   ├── requirements.txt              # Python dependencies
│   └── uploads/                      # Temporary file upload directory
├── frontend/                         # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.jsx                   # Main app component
│   │   ├── App.css                   # Main app styling
│   │   ├── index.js                  # React entry point
│   │   ├── services/
│   │   │   └── api.js                # API client services
│   │   └── components/
│   │       ├── ChatInterface.jsx      # Chat UI component
│   │       ├── ChatMessage.jsx        # Individual message display
│   │       ├── SessionSidebar.jsx     # Session management sidebar
│   │       ├── Loader.jsx             # Loading indicator
│   │       └── AdminPanel.jsx         # Admin upload panel (NEW)
│   ├── package.json                  # Node.js dependencies
│   └── README.md                     # Frontend documentation
├── scripts/
│   └── chunking_script.py            # Document chunking utility
├── chunks.db                         # SQLite database (stores embeddings)
└── README.md                         # This file
```

---

## Features in Detail

### 1. **Hybrid Search System**
- **FAISS Index**: Fast similarity-based semantic search using embeddings
- **BM25 Ranking**: Traditional keyword-based relevance matching
- **Configurable Alpha**: Blend factor between semantic (0.6) and keyword (0.4) search
- **Top-K Retrieval**: Retrieves top 8 most relevant chunks from indexed documents

### 2. **Semantic Chunking**
- **Similarity-based Segmentation**: Groups sentences by semantic similarity (90% threshold)
- **Embedding-aware**: Uses pre-computed embeddings (all-MiniLM-L6-v2 model)
- **Context Preservation**: Maintains semantic coherence within chunks

### 3. **Multi-Document Support**
| Format | Support | Notes |
|--------|---------|-------|
| PDF    | ✅ | Page-aware chunking |
| DOCX   | ✅ | Paragraph-based extraction |
| PPTX   | ✅ | Slide-aware processing |

### 4. **Admin Document Upload** ⭐ NEW
- **Password Protected**: Admin-only access with password: `admin@123`
- **Batch Upload**: Upload multiple documents simultaneously
- **Auto-Processing**: Automatic chunking and database ingestion
- **Progress Feedback**: Real-time upload and processing status

### 5. **Session Management**
- **Persistent Sessions**: Chat history saved in SQLite
- **Message Tracking**: Complete conversation history with timestamps
- **Session CRUD**: Create, read, update, delete operations
- **Auto-session Creation**: Automatic session creation if needed

### 6. **Response Optimization**
- **Query Caching**: Identical questions return cached responses
- **Source Attribution**: Cites document sources for all answers
- **Markdown Formatting**: Rich formatting including tables and emphasis
- **Fallback Handling**: Graceful handling when insufficient context available

---

## Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.104.1 |
| Server | Uvicorn | 0.24.0 |
| Database | SQLite3 | Native |
| Embeddings | Sentence-Transformers | 2.2.2 |
| Vector Search | FAISS | 1.7.4 |
| Keyword Search | rank-bm25 | 0.2.2 |
| PDF Parsing | PyMuPDF (fitz) | 1.23.8 |
| DOCX Parsing | python-docx | 1.1.0 |
| PPTX Parsing | python-pptx | 0.6.23 |
| NLP | NLTK | 3.8.1 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.x |
| UI Library | Material-UI (MUI) | Latest |
| HTTP Client | Axios | Latest |
| Icons | Material Icons | Latest |

### Infrastructure
- **Local LLM**: Ollama (`gpt-oss:20b-cloud` model)
- **Backend Server**: Python 3.9+
- **Frontend Dev**: Node.js 14+ with npm/yarn

---

## Installation & Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 14+ with npm
- Ollama with a suitable model installed
- SQLite3

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLTK data (one-time)**
   ```bash
   python -c "import nltk; nltk.download('punkt')"
   ```

5. **Ensure database exists**
   - Place `chunks.db` in the backend directory
   - Or create it by running the chunking script first

6. **Start backend server**
   ```bash
   python app.py
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Ollama Setup

1. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai)
   - Follow platform-specific installation

2. **Pull required model**
   ```bash
   ollama pull gpt-oss:20b-cloud
   ```

3. **Start Ollama service**
   ```bash
   ollama serve
   ```

---

## Usage Guide

### Adding Documents (Admin Upload)

1. **Access Admin Panel**
   - Click the security icon (🔒) at bottom-right of the chat interface
   
2. **Enter Password**
   - Password: `admin@123`

3. **Select Documents**
   - Click the upload area or drag-and-drop PDF, DOCX, or PPTX files
   - Multiple files can be selected simultaneously

4. **Process Documents**
   - Click "Upload & Process"
   - Monitor progress in the dialog
   - Documents are automatically chunked and added to knowledge base

### Asking Questions

1. **Create/Select Chat Session**
   - Create a new session from the sidebar
   - Or select existing session

2. **Type Question**
   - Ask natural language questions about your documents
   - Example: "What are the main findings?"

3. **View Answer**
   - AI synthesizes answer from document chunks
   - Sources are cited at the bottom
   - Response includes markdown formatting

### Adjusting Search Balance

1. **Open Session Sidebar**
   - Click the menu icon at top-left

2. **Adjust Alpha Slider**
   - Alpha = 0.0: Pure keyword search (BM25)
   - Alpha = 0.5: Balanced search
   - Alpha = 1.0: Pure semantic search (FAISS)

---

## API Documentation

### Base URL
```
http://localhost:8000
```

### Chat Endpoints

#### Create Session
```http
POST /api/sessions
Content-Type: application/json

{
  "name": "Project Discussion"
}
```

#### Get All Sessions
```http
GET /api/sessions
```

#### Get Session Messages
```http
GET /api/sessions/{session_id}/messages
```

#### Delete Session
```http
DELETE /api/sessions/{session_id}
```

#### Ask Question
```http
POST /api/ask
Content-Type: application/json

{
  "session_id": 1,
  "question": "What is the main topic?",
  "use_cache": true
}
```

### System Endpoints

#### Health Check
```http
GET /api/health
```

#### Get Statistics
```http
GET /api/stats
```

#### Set Alpha Parameter
```http
PUT /api/alpha/{alpha_value}
```

### Admin Endpoints

#### Upload & Process Documents ⭐
```http
POST /api/admin/upload
Authorization: Bearer {password}
Content-Type: multipart/form-data

Files: [file1.pdf, file2.docx, file3.pptx]
password: admin@123
```

**Response (Success)**
```json
{
  "status": "success",
  "message": "Processed 3 file(s)",
  "files": ["file1.pdf", "file2.docx", "file3.pptx"]
}
```

**Response (Error)**
```json
{
  "detail": "Invalid admin password"
}
```

---

## Configuration

### Backend Configuration (`backend/config.py`)

```python
# Database
DB_PATH = BASE_DIR / "chunks.db"

# Embedding Model
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # 384-dimensional embeddings

# Retrieval Settings
TOP_K_FAISS = 100          # FAISS top K before merging
TOP_K_BM25 = 100           # BM25 top K before merging
FINAL_TOP_K = 8            # Final results returned
DEFAULT_ALPHA = 0.6        # Default semantic/keyword blend
MIN_COMBINED_SCORE = 0.12  # Minimum score to attempt answer

# LLM
OLLAMA_MODEL = "gpt-oss:20b-cloud"

# Admin Authentication
ADMIN_PASSWORD = "admin@123"

# API
API_HOST = "0.0.0.0"
API_PORT = 8000
```

### Chunking Configuration

```python
SIMILARITY_THRESHOLD = 0.9   # 90% similarity for semantic chunking
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
```

---

## Performance Optimization

### Tips for Better Performance

1. **Optimal Chunk Size**
   - Current: Semantic similarity based (90% threshold)
   - Results in chunks of 50-300 tokens average

2. **Search Parameter Tuning**
   - Lower `MIN_COMBINED_SCORE` for broader searches
   - Adjust `FINAL_TOP_K` for more/fewer results
   - Modify `DEFAULT_ALPHA` for semantic vs keyword balance

3. **Caching**
   - Enable `use_cache: true` for repeated questions
   - Significantly faster responses for common queries

4. **Index Maintenance**
   - Periodically backup `chunks.db`
   - Monitor database size for large document collections

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Backend not responding | Ensure `python app.py` is running on port 8000 |
| Frontend can't connect | Check CORS settings, verify backend URL |
| Ollama errors | Ensure `ollama serve` is running, model is pulled |
| PDFs not extracting | Verify PDF is not encrypted, try re-uploading |
| Out of memory | Reduce `TOP_K_FAISS` or `TOP_K_BM25` values |
| Slow responses | Disable caching, check Ollama model performance |

### Debug Mode

**Backend**: Set environment variable `DEBUG=1` for verbose logging
```bash
DEBUG=1 python app.py
```

**Frontend**: Check browser console (F12) for network and JS errors

---

## File Format Specifications

### PDF Support
- Standard PDFs with selectable text
- Scanned PDFs (OCR'd) recommended for best results
- Max file size: No hard limit (tested up to 500MB)

### DOCX Support
- Microsoft Word documents
- Preserves paragraph structure
- Tables and formatting handled intelligently

### PPTX Support
- PowerPoint presentations
- Extracts text from all shapes and text boxes
- Slide order preserved in processing

---

## Database Schema

### Main Tables

#### `{document_name}` (Document-specific)
```sql
CREATE TABLE "{document_name}" (
    chunk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_number INTEGER,
    chunk_text TEXT,
    embedding BLOB  -- Pickled numpy array
);
```

#### `chat_sessions`
```sql
CREATE TABLE chat_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `chat_messages`
```sql
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    role TEXT,  -- 'user' or 'assistant'
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES chat_sessions(session_id)
);
```

#### `question_cache`
```sql
CREATE TABLE question_cache (
    question TEXT PRIMARY KEY,
    answer TEXT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Advanced Usage

### Batch Processing Documents

Use the chunking script directly:
```bash
cd backend
python ../scripts/chunking_script.py
```

Then update `DIRECTORY` variable in the script to point to your documents folder.

### Customizing Embeddings Model

1. Edit `backend/config.py`:
   ```python
   EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"  # Larger, better quality
   ```

2. Rebuild indices or restart backend

### Using Different LLM

1. Install desired model with Ollama:
   ```bash
   ollama pull llama2  # or other model
   ```

2. Update `backend/config.py`:
   ```python
   OLLAMA_MODEL = "llama2"
   ```

---

## Performance Benchmarks

(These are approximate; actual performance varies by hardware)

| Operation | Time | Notes |
|-----------|------|-------|
| Load embeddings (1000 chunks) | ~2s | First-time startup |
| Query processing | ~3-5s | With Ollama inference |
| Cache hit response | ~100ms | Pre-computed answer |
| PDF chunking (100 pages) | ~30s | First-time processing |

---

## Security Considerations

⚠️ **Important**: This system is designed for local deployment. For production:

1. **API Authentication**
   - Implement proper JWT or OAuth2
   - Current admin password is for demo only

2. **Document Privacy**
   - All documents stored locally in SQLite
   - Embeddings never sent to external servers
   - LLM runs locally via Ollama

3. **HTTPS**
   - Use reverse proxy (nginx) for HTTPS in production
   - Enable CORS only for trusted origins

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## Roadmap

- [ ] Support for more document formats (HTML, Markdown, TXT)
- [ ] Multi-language support
- [ ] User authentication system
- [ ] Document metadata extraction
- [ ] Answer quality scoring
- [ ] Document upload history
- [ ] Advanced search filters
- [ ] Export conversation to PDF
- [ ] REST API rate limiting
- [ ] Performance monitoring dashboard

---

## Acknowledgments

- [FAISS](https://github.com/facebookresearch/faiss) - Efficient similarity search
- [Sentence-Transformers](https://www.sbert.net/) - Embedding models
- [Ollama](https://ollama.ai/) - Local LLM inference
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Material-UI](https://mui.com/) - React component library

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing [GitHub Issues](https://github.com/yourrepo/issues)
3. Create a new issue with detailed information
4. Include backend/frontend logs if applicable

---

## Version History

### v1.1.0 (Current)
- ✨ Added admin password-protected upload panel
- 🔐 Integrated chunking script with backend
- 📤 Support for batch document uploads
- 🐛 Bug fixes and performance improvements

### v1.0.0
- 🎉 Initial release with core RAG functionality
- 💬 Chat interface with session management
- 🔍 Hybrid search (FAISS + BM25)
- 📄 Multi-format document support

---

**Last Updated**: 2026-04-13
**Maintained By**: RAG Development Team