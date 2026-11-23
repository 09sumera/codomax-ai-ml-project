from flask import Blueprint, request
from backend.services.route_storage_service import RouteStorageService
from backend.utils.auth_middleware import optional_token
from backend.utils.response import success_response, error_response

saved_routes_bp = Blueprint('saved_routes', __name__)

@saved_routes_bp.route('/api/routes/saved', methods=['GET'], strict_slashes=False)
@optional_token
def get_saved_routes():
    try:
        user_id = None
        if hasattr(request, 'current_user') and request.current_user:
            user_id = request.current_user.get('user_id')
        if not user_id:
            user_id = request.args.get('user_id') or request.headers.get('X-User-Id')

        routes = RouteStorageService.get_all_routes(user_id=user_id)
        return success_response(data={"routes": routes})
    except Exception as e:
        return error_response('DB_ERROR', str(e), status_code=500)

@saved_routes_bp.route('/api/routes/save', methods=['POST'], strict_slashes=False)
@optional_token
def save_route():
    try:
        data = request.json
        if not data:
            return error_response('INVALID_INPUT', 'Request body is empty', status_code=400)

        user_id = None
        if hasattr(request, 'current_user') and request.current_user:
            user_id = request.current_user.get('user_id')
        if not user_id:
            user_id = data.get('user_id') or request.headers.get('X-User-Id')
            
        # Fetch POIs if not provided and coordinates are available
        if "pois" not in data or not data.get("pois"):
            try:
                orig = data.get("origin") or {}
                dest = data.get("destination") or {}
                geom = data.get("route_geometry")
                if "latitude" in orig and "longitude" in orig and "latitude" in dest and "longitude" in dest:
                    from backend.services.poi_service import POIService
                    data["pois"] = POIService.get_pois_along_route(geom, orig, dest)
                else:
                    data["pois"] = {}
            except Exception as poi_err:
                data["pois"] = {}
            
        saved_route = RouteStorageService.save_route(data, user_id=user_id)
        return success_response(data=saved_route, message="Route saved successfully")
    except Exception as e:
        return error_response('DB_ERROR', str(e), status_code=500)

@saved_routes_bp.route('/api/routes/saved/<route_id>', methods=['GET'], strict_slashes=False)
@optional_token
def get_single_saved_route(route_id):
    try:
        user_id = None
        if hasattr(request, 'current_user') and request.current_user:
            user_id = request.current_user.get('user_id')
        if not user_id:
            user_id = request.args.get('user_id') or request.headers.get('X-User-Id')

        route = RouteStorageService.get_route(route_id, user_id=user_id)
        if not route:
            return error_response('NOT_FOUND', 'Route not found', status_code=404)
        return success_response(data=route)
    except Exception as e:
        return error_response('DB_ERROR', str(e), status_code=500)

@saved_routes_bp.route('/api/routes/saved/<route_id>', methods=['DELETE'], strict_slashes=False)
@optional_token
def delete_saved_route(route_id):
    try:
        user_id = None
        if hasattr(request, 'current_user') and request.current_user:
            user_id = request.current_user.get('user_id')
        if not user_id:
            user_id = request.args.get('user_id') or request.headers.get('X-User-Id')

        deleted = RouteStorageService.delete_route(route_id, user_id=user_id)
        if not deleted:
            return error_response('NOT_FOUND', 'Route not found or unauthorized to delete', status_code=404)
        return success_response(message="Route deleted successfully")
    except Exception as e:
        return error_response('DB_ERROR', str(e), status_code=500)
