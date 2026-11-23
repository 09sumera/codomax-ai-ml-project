import os
from dotenv import load_dotenv

# Try loading backend/.env first, then fallback to current working directory .env
backend_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)
load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    PORT = int(os.getenv('PORT') or 5000)
    _model_path = os.getenv(
    'MODEL_PATH',
    'model/routesheild_xgboost_model.json'
    )
    _prep_path = os.getenv(
    'PREPROCESSOR_PATH',
    'model/routesheild_preprocessor.joblib'
    )
    MODEL_PATH = _model_path if os.path.isabs(_model_path) else os.path.join(BASE_DIR, _model_path)
    PREPROCESSOR_PATH = _prep_path if os.path.isabs(_prep_path) else os.path.join(BASE_DIR, _prep_path)
    MONGO_URI = os.getenv('MONGO_URI')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'routesheild')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'routeshield-secure-jwt-key-2026-production')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '72'))
