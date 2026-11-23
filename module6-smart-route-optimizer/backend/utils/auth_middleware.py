from functools import wraps
from flask import request
from backend.services.user_service import UserService
from backend.utils.response import error_response

def get_current_user_from_request():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == 'bearer':
            token = parts[1]
            try:
                payload = UserService.verify_token(token)
                return payload
            except Exception:
                return None
    # Support X-User-Id header as secondary fallback for internal requests
    user_id = request.headers.get('X-User-Id')
    if user_id:
        user = UserService.get_user_by_id(user_id)
        if user:
            return user
    return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            # Check X-User-Id fallback
            fallback_user_id = request.headers.get('X-User-Id')
            if fallback_user_id:
                user = UserService.get_user_by_id(fallback_user_id)
                if user:
                    request.current_user = user
                    return f(*args, **kwargs)
            return error_response('UNAUTHORIZED', 'Authentication token is missing. Please sign in.', status_code=401)
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return error_response('INVALID_TOKEN', 'Authorization header format must be Bearer <token>', status_code=401)

        token = parts[1]
        try:
            payload = UserService.verify_token(token)
            request.current_user = payload
        except ValueError as err:
            return error_response('UNAUTHORIZED', str(err), status_code=401)
        except Exception as e:
            return error_response('UNAUTHORIZED', f'Authentication failed: {str(e)}', status_code=401)

        return f(*args, **kwargs)
    return decorated

def optional_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        request.current_user = get_current_user_from_request()
        return f(*args, **kwargs)
    return decorated
