from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_bp.post("/register")
def register():
	data = request.get_json()

	result = AuthService.register(data)

	if not result["success"]:
		return jsonify(result), 400

	return jsonify(result), 201


@auth_bp.post("/login")
def login():
	data = request.get_json()
 
	user = AuthService.login(data)
 
	if not user:
		return jsonify({
			"success": False,
			"message": "Invalid email or password"
		}), 401
 
	if not user.is_active:
		return jsonify({
			"success": False,
			"message": "Your account has been suspended. Please contact support."
		}), 403
 
	token = create_access_token(
		identity=str(user.id),
		additional_claims={"role": user.role}
	)
 
	return jsonify({
		"success": True,
		"token": token,
		"user": {
			"id": user.id,
			"fullname": user.fullname,
			"email": user.email,
			"role": user.role
		}
	})
 