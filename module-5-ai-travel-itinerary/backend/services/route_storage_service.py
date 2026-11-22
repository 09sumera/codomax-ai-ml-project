import os
import json
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient
from backend.config.config import Config
from backend.utils.logger import get_logger

logger = get_logger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
LOCAL_ROUTES_FILE = os.path.join(DATA_DIR, 'saved_routes.json')

class RouteStorageService:
    _client = None
    _db = None
    _mongo_available = None

    @classmethod
    def _ensure_data_dir(cls):
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(LOCAL_ROUTES_FILE):
            with open(LOCAL_ROUTES_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)

    _last_failed_time = 0

    @classmethod
    def mark_mongo_failed(cls):
        import time
        cls._last_failed_time = time.time()
        cls._client = None
        cls._db = None

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
                logger.warning(f"MongoDB connection failed in RouteStorageService: {e}. Falling back to local file storage.")
                cls._last_failed_time = now
                cls._db = None
        return cls._db

    @classmethod
    def _read_local_routes(cls):
        cls._ensure_data_dir()
        try:
            with open(LOCAL_ROUTES_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []

    @classmethod
    def _write_local_routes(cls, routes):
        cls._ensure_data_dir()
        with open(LOCAL_ROUTES_FILE, 'w', encoding='utf-8') as f:
            json.dump(routes, f, indent=2)

    @classmethod
    def save_route(cls, route_data, user_id=None):
        assigned_user_id = user_id or route_data.get("user_id") or "anonymous"
        route_id = str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()
        
        doc = {
            "route_id": route_id,
            "user_id": assigned_user_id,
            "origin": route_data.get("origin", {}),
            "destination": route_data.get("destination", {}),
            "distance_km": route_data.get("distance_km"),
            "duration_minutes": route_data.get("duration_minutes"),
            "route_geometry": route_data.get("route_geometry", {}),
            "google_maps_url": route_data.get("google_maps_url", ""),
            "route_summary": route_data.get("route_summary", ""),
            "risk": route_data.get("risk", {}),
            "recommendation": route_data.get("recommendation", {}),
            "pois": route_data.get("pois", {}),
            "created_at": now_iso,
            "updated_at": now_iso,
            "offline_package_version": 1
        }
        
        db = cls.get_db()
        if db is not None:
            try:
                db.saved_routes.insert_one(doc)
                del doc["_id"]
                return doc
            except Exception as e:
                logger.warning(f"Failed to insert into MongoDB: {e}. Falling back to local store.")

        # Local fallback
        local_routes = cls._read_local_routes()
        local_routes.insert(0, doc)
        cls._write_local_routes(local_routes)
        return doc

    @classmethod
    def get_all_routes(cls, user_id=None):
        query = {}
        if user_id:
            query = {"$or": [{"user_id": user_id}, {"user_id": "anonymous"}]}

        db = cls.get_db()
        if db is not None:
            try:
                routes = list(db.saved_routes.find(query, {"_id": 0}).sort("created_at", -1))
                return routes
            except Exception as e:
                logger.warning(f"Failed to fetch from MongoDB: {e}. Falling back to local store.")

        local_routes = cls._read_local_routes()
        if user_id:
            return [r for r in local_routes if r.get("user_id") == user_id or r.get("user_id") == "anonymous"]
        return local_routes

    @classmethod
    def get_route(cls, route_id, user_id=None):
        query = {"route_id": route_id}
        if user_id:
            query["$or"] = [{"user_id": user_id}, {"user_id": "anonymous"}]

        db = cls.get_db()
        if db is not None:
            try:
                route = db.saved_routes.find_one(query, {"_id": 0})
                if route:
                    return route
            except Exception as e:
                logger.warning(f"Failed to query route from MongoDB: {e}.")

        local_routes = cls._read_local_routes()
        for r in local_routes:
            if r.get("route_id") == route_id:
                if not user_id or r.get("user_id") == user_id or r.get("user_id") == "anonymous":
                    return r
        return None

    @classmethod
    def delete_route(cls, route_id, user_id=None):
        query = {"route_id": route_id}
        if user_id:
            query["$or"] = [{"user_id": user_id}, {"user_id": "anonymous"}]

        db = cls.get_db()
        if db is not None:
            try:
                result = db.saved_routes.delete_one(query)
                if result.deleted_count > 0:
                    return True
            except Exception as e:
                logger.warning(f"Failed to delete route in MongoDB: {e}.")

        local_routes = cls._read_local_routes()
        orig_len = len(local_routes)
        filtered = [
            r for r in local_routes
            if not (r.get("route_id") == route_id and (not user_id or r.get("user_id") == user_id or r.get("user_id") == "anonymous"))
        ]
        if len(filtered) < orig_len:
            cls._write_local_routes(filtered)
            return True
        return False
