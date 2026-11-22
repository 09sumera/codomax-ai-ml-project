from flask import Blueprint, request
from backend.services.user_service import UserService
from backend.utils.auth_middleware import token_required
from backend.utils.response import success_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    try:
        data = request.json or {}
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'Fleet Dispatcher')
        company = data.get('company', 'Global Logistics Corp')

        result = UserService.register_user(
            name=name,
            email=email,
            password=password,
            role=role,
            company=company
        )
        result["data"] = {"user": result["user"], "token": result["token"]}
        return success_response(data=result, message="Account registered successfully", status_code=201)
    except ValueError as val_err:
        return error_response('VALIDATION_ERROR', str(val_err), status_code=400)
    except Exception as e:
        return error_response('REGISTRATION_FAILED', f"Failed to register account: {str(e)}", status_code=500)

@auth_bp.route('/login', methods=['POST'], strict_slashes=False)
def login():
    try:
        data = request.json or {}
        email = data.get('email')
        password = data.get('password')

        result = UserService.login_user(email=email, password=password)
        result["data"] = {"user": result["user"], "token": result["token"]}
        return success_response(data=result, message="Logged in successfully")
    except ValueError as val_err:
        return error_response('AUTH_ERROR', str(val_err), status_code=401)
    except Exception as e:
        return error_response('LOGIN_FAILED', f"Login failed: {str(e)}", status_code=500)

@auth_bp.route('/me', methods=['GET'], strict_slashes=False)
@token_required
def get_current_user_profile():
    try:
        user_id = request.current_user.get('user_id')
        user_profile = UserService.get_user_by_id(user_id)
        if not user_profile:
            # Fallback to payload data
            user_profile = {
                "user_id": user_id,
                "name": request.current_user.get('name'),
                "email": request.current_user.get('email'),
                "role": request.current_user.get('role'),
                "company": request.current_user.get('company')
            }
        return success_response(data={"user": user_profile})
    except Exception as e:
        return error_response('FETCH_PROFILE_FAILED', str(e), status_code=500)

@auth_bp.route('/demo', methods=['GET'], strict_slashes=False)
def get_demo_account():
    """Returns the pre-configured demo fleet credentials and ensures demo account exists."""
    UserService.seed_demo_user()
    return success_response(data={
        "email": "demo@routeshield.ai",
        "password": "routeshield123",
        "name": "Alex Mercer",
        "role": "Chief Logistics Controller",
        "company": "Pacific-Atlantic Cargo Line"
    }, message="Demo credentials ready")
