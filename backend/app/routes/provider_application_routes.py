from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.provider_application_service import ProviderApplicationService
from app.utils.role_required import role_required

provider_application_bp = Blueprint(
    "provider_applications",
    __name__,
    url_prefix="/api/v1/provider-applications"
)


# ----------------------------
# Submit an application (any logged-in client)
# ----------------------------
@provider_application_bp.post("/")
@jwt_required()
def create_application():

    data = request.get_json()
    data["user_id"] = int(get_jwt_identity())

    result = ProviderApplicationService.create(data)

    status = 201 if result["success"] else 400

    return jsonify(result), status


# ----------------------------
# List all applications (admin only) — optional ?status=pending filter
# ----------------------------
@provider_application_bp.get("/")
@jwt_required()
@role_required("admin")
def get_applications():

    status_filter = request.args.get("status")
    applications = ProviderApplicationService.get_all(status_filter)

    return jsonify({
        "success": True,
        "applications": [
            {
                "id": a.id,
                "user_id": a.user_id,
                "fullname": a.user.fullname if a.user else None,
                "category_id": a.category_id,
                "category_name": a.category.name if a.category else None,
                "business_name": a.business_name,
                "experience": a.experience,
                "phone": a.phone,
                "address": a.address,
                "skills": a.skills,
                "availability": a.availability,
                "hourly_rate": a.hourly_rate,
                "status": a.status,
            }
            for a in applications
        ]
    })


# ----------------------------
# Check my own application status (any logged-in user)
# ----------------------------
@provider_application_bp.get("/mine")
@jwt_required()
def get_my_application():

    user_id = int(get_jwt_identity())
    application = ProviderApplicationService.get_by_user(user_id)

    if not application:
        return jsonify({"success": True, "application": None})

    return jsonify({
        "success": True,
        "application": {
            "id": application.id,
            "status": application.status,
        }
    })


# ----------------------------
# Approve (admin only) — grants the "provider" role + creates the profile
# ----------------------------
@provider_application_bp.post("/<int:application_id>/approve")
@jwt_required()
@role_required("admin")
def approve_application(application_id):

    result = ProviderApplicationService.approve(application_id)

    status = 200 if result["success"] else 400

    return jsonify(result), status


# ----------------------------
# Reject (admin only)
# ----------------------------
@provider_application_bp.post("/<int:application_id>/reject")
@jwt_required()
@role_required("admin")
def reject_application(application_id):

    result = ProviderApplicationService.reject(application_id)

    status = 200 if result["success"] else 400

    return jsonify(result), status
