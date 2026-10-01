from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.user_service import UserService

user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/v1/users"
)


@user_bp.patch("/me")
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())
    data = request.get_json()

    result = UserService.update_profile(user_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@user_bp.post("/me/change-password")
@jwt_required()
def change_password():

    user_id = int(get_jwt_identity())
    data = request.get_json()

    result = UserService.change_password(user_id, data)

    status = 200 if result["success"] else 400

    return jsonify(result), status


@user_bp.get("/me/settings")
@jwt_required()
def get_settings():

    user_id = int(get_jwt_identity())

    result = UserService.get_settings(user_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@user_bp.patch("/me/settings")
@jwt_required()
def update_settings():

    user_id = int(get_jwt_identity())
    data = request.get_json()

    result = UserService.update_notification_settings(user_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@user_bp.delete("/me")
@jwt_required()
def delete_account():

    user_id = int(get_jwt_identity())

    result = UserService.delete_account(user_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status
