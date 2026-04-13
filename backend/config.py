import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database path
DB_PATH = BASE_DIR / "chunks.db"

# Model settings
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
OLLAMA_MODEL = "gpt-oss:20b-cloud"

# Retrieval settings
TOP_K_FAISS = 100
TOP_K_BM25 = 100
FINAL_TOP_K = 8
DEFAULT_ALPHA = 0.6
MIN_COMBINED_SCORE = 0.12

# API settings
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]