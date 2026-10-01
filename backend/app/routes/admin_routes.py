from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.admin_service import AdminService
from app.utils.role_required import role_required

admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/v1/admin"
)


@admin_bp.get("/stats")
@jwt_required()
@role_required("admin")
def get_stats():

    stats = AdminService.get_stats()

    return jsonify({
        "success": True,
        "totalUsers": stats["total_users"],
        "totalProviders": stats["total_providers"],
        "totalWorks": stats["total_works"],
        "pendingApplications": stats["pending_applications"],
    })


@admin_bp.get("/users")
@jwt_required()
@role_required("admin")
def get_users():

    users = AdminService.get_all_users()

    return jsonify({
        "success": True,
        "users": [
            {
                "id": u.id,
                "fullname": u.fullname,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
            }
            for u in users
        ]
    })


@admin_bp.post("/users/<int:user_id>/suspend")
@jwt_required()
@role_required("admin")
def suspend_user(user_id):

    result = AdminService.suspend_user(user_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@admin_bp.post("/users/<int:user_id>/reactivate")
@jwt_required()
@role_required("admin")
def reactivate_user(user_id):

    result = AdminService.reactivate_user(user_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status
