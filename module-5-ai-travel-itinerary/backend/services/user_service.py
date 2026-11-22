import os
import json
import uuid
import jwt
from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from backend.config.config import Config
from backend.utils.logger import get_logger

logger = get_logger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
LOCAL_USERS_FILE = os.path.join(DATA_DIR, 'users.json')

class UserService:
    _client = None
    _db = None
    _mongo_available = None

    @classmethod
    def _ensure_data_dir(cls):
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(LOCAL_USERS_FILE):
            with open(LOCAL_USERS_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)

    _last_failed_time = 0

    @classmethod
    def get_db(cls):
        import time
        now = time.time()
        if cls._last_failed_time and (now - cls._last_failed_time < 60):
            return None

        if cls._client is None:
            if not Config.MONGO_URI:
                cls._last_failed_time = now
                return None
            try:
                cls._client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=1500, connectTimeoutMS=1500)
                cls._db = cls._client[Config.MONGO_DB_NAME]
            except Exception as e:
                logger.warning(f"MongoDB connection failed: {e}. Falling back to local file storage.")
                cls._last_failed_time = now
                cls._db = None
        return cls._db

    @classmethod
    def mark_mongo_failed(cls):
        import time
        cls._last_failed_time = time.time()
        cls._client = None
        cls._db = None

    @classmethod
    def _read_local_users(cls):
        cls._ensure_data_dir()
        try:
            with open(LOCAL_USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []

    @classmethod
    def _write_local_users(cls, users):
        cls._ensure_data_dir()
        with open(LOCAL_USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)

    @classmethod
    def seed_demo_user(cls):
        """Ensure demo user exists for effortless evaluation and quick login."""
        demo_email = "demo@routeshield.ai"
        try:
            db = cls.get_db()
            if db is not None:
                existing = db.users.find_one({"email": demo_email})
                if not existing:
                    demo_user = {
                        "user_id": "usr_demo_fleet_mgr",
                        "name": "Alex Mercer",
                        "email": demo_email,
                        "role": "Chief Logistics Controller",
                        "company": "Pacific-Atlantic Cargo Line",
                        "password_hash": generate_password_hash("routeshield123"),
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                    db.users.insert_one(demo_user)
                    logger.info("Seeded demo user in MongoDB: demo@routeshield.ai")
                return
        except Exception as e:
            logger.warning(f"Failed to check/seed demo user in MongoDB: {e}")

        # Local fallback seed
        local_users = cls._read_local_users()
        if not any(u.get("email") == demo_email for u in local_users):
            demo_user = {
                "user_id": "usr_demo_fleet_mgr",
                "name": "Alex Mercer",
                "email": demo_email,
                "role": "Chief Logistics Controller",
                "company": "Pacific-Atlantic Cargo Line",
                "password_hash": generate_password_hash("routeshield123"),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            local_users.append(demo_user)
            cls._write_local_users(local_users)
            logger.info("Seeded demo user in local storage: demo@routeshield.ai")

    @classmethod
    def register_user(cls, name, email, password, role="Fleet Dispatcher", company="Global Logistics Corp"):
        if not name or not name.strip():
            raise ValueError("Full Name is required")
        if not email or "@" not in email:
            raise ValueError("A valid Email address is required")
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")

        clean_email = email.strip().lower()
        clean_name = name.strip()
        clean_role = role.strip() if role else "Fleet Dispatcher"
        clean_company = company.strip() if company else "Global Logistics Corp"

        # Check existing user
        db = cls.get_db()
        existing = None
        if db is not None:
            try:
                existing = db.users.find_one({"email": clean_email})
            except Exception as e:
                logger.warning(f"Failed to query MongoDB users: {e}. Falling back to local store.")
                cls.mark_mongo_failed()

        if existing:
            raise ValueError("An account with this email already exists")

        local_users = cls._read_local_users()
        if any(u.get("email") == clean_email for u in local_users):
            raise ValueError("An account with this email already exists")

        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        password_hash = generate_password_hash(password)
        now_iso = datetime.now(timezone.utc).isoformat()

        user_doc = {
            "user_id": user_id,
            "name": clean_name,
            "email": clean_email,
            "role": clean_role,
            "company": clean_company,
            "password_hash": password_hash,
            "created_at": now_iso,
            "updated_at": now_iso
        }

        inserted_in_db = False
        if db is not None:
            try:
                db.users.insert_one(user_doc.copy())
                inserted_in_db = True
            except Exception as e:
                logger.warning(f"Failed to insert user into MongoDB: {e}. Saving to local store.")

        # Always also keep local copy synced
        local_users.append(user_doc)
        cls._write_local_users(local_users)

        sanitized_user = {
            "user_id": user_id,
            "name": clean_name,
            "email": clean_email,
            "role": clean_role,
            "company": clean_company,
            "created_at": now_iso
        }

        token = cls.generate_token(sanitized_user)
        return {
            "user": sanitized_user,
            "token": token
        }

    @classmethod
    def login_user(cls, email, password):
        if not email or not password:
            raise ValueError("Email and password are required")

        clean_email = email.strip().lower()

        user_doc = None
        db = cls.get_db()
        if db is not None:
            try:
                user_doc = db.users.find_one({"email": clean_email})
            except Exception as e:
                logger.warning(f"Error querying user from MongoDB: {e}")
                cls.mark_mongo_failed()

        if not user_doc:
            local_users = cls._read_local_users()
            user_doc = next((u for u in local_users if u.get("email") == clean_email), None)

        if not user_doc or not check_password_hash(user_doc.get("password_hash", ""), password):
            raise ValueError("Invalid email or password")

        sanitized_user = {
            "user_id": user_doc["user_id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": user_doc.get("role", "Fleet Dispatcher"),
            "company": user_doc.get("company", "Global Logistics Corp"),
            "created_at": user_doc.get("created_at")
        }

        token = cls.generate_token(sanitized_user)
        return {
            "user": sanitized_user,
            "token": token
        }

    @classmethod
    def get_user_by_id(cls, user_id):
        if not user_id:
            return None

        db = cls.get_db()
        user_doc = None
        if db is not None:
            try:
                user_doc = db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
            except Exception:
                pass

        if not user_doc:
            local_users = cls._read_local_users()
            found = next((u for u in local_users if u.get("user_id") == user_id), None)
            if found:
                user_doc = {
                    "user_id": found["user_id"],
                    "name": found["name"],
                    "email": found["email"],
                    "role": found.get("role", "Fleet Dispatcher"),
                    "company": found.get("company", "Global Logistics Corp"),
                    "created_at": found.get("created_at")
                }

        return user_doc

    @classmethod
    def generate_token(cls, user_data):
        now = datetime.now(timezone.utc)
        exp = now + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
        payload = {
            "user_id": user_data["user_id"],
            "email": user_data["email"],
            "name": user_data["name"],
            "role": user_data.get("role", "Fleet Dispatcher"),
            "company": user_data.get("company", "Global Logistics Corp"),
            "iat": int(now.timestamp()),
            "exp": int(exp.timestamp())
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

    @classmethod
    def verify_token(cls, token):
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Session token has expired. Please sign in again.")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid authentication token. Please sign in again.")
