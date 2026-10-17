from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.repository.provider_repository import ProviderRepository
from app.services.provider_service import ProviderService
from app.utils.role_required import role_required

provider_bp = Blueprint(
    "providers",
    __name__,
    url_prefix="/api/v1/providers"
)


@provider_bp.post("/")
@jwt_required()
@role_required("provider")
def create_provider():

    data = request.get_json()

    data["user_id"] = int(get_jwt_identity())

    result = ProviderService.create(data)

    status = 201 if result["success"] else 400

    return jsonify(result), status



@provider_bp.get("/<int:provider_id>")
def get_provider(provider_id):

    provider = ProviderService.get_by_id(provider_id)

    if not provider:
        return jsonify({
            "success": False,
            "message": "Provider not found"
        }), 404

    return jsonify({
        "success": True,
        "provider": {
            "id": provider.id,
            "business_name": provider.business_name,
            "bio": provider.bio,
            "experience": provider.experience,
            "hourly_rate": provider.hourly_rate,
            "phone": provider.phone,
            "city": provider.city,
            "state": provider.state,
            "rating": provider.average_rating,
            "verified": provider.is_verified
        }
    })

@provider_bp.put("/<int:provider_id>")
def update_provider(provider_id):

    data = request.get_json()

    result = ProviderService.update(provider_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@provider_bp.delete("/<int:provider_id>")
def delete_provider(provider_id):

    result = ProviderService.delete(provider_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status

@provider_bp.get("/me")
@jwt_required()
def get_my_provider_profile():
 
    user_id = int(get_jwt_identity())
    provider = ProviderRepository.get_by_user_id(user_id)
 
    if not provider:
        return jsonify({
            "success": False,
            "message": "No provider profile found for this account"
        }), 404
 
    return jsonify({
        "success": True,
        "provider": {
            "id": provider.id,
            "business_name": provider.business_name,
            "bio": provider.bio,
            "experience": provider.experience,
            "hourly_rate": provider.hourly_rate,
            "phone": provider.phone,
            "city": provider.city,
            "state": provider.state,
            "rating": provider.average_rating,
            "verified": provider.is_verified,
            "category_id": provider.category_id,
            "category_name": provider.category.name if provider.category else None,
        }
    })
@provider_bp.get("/")
def get_providers():
    providers = ProviderService.get_all()

    return jsonify({
        "success": True,
        "providers": [
            {
                "id": p.id,
                "business_name": p.business_name,
                "city": p.city,
                "state": p.state,
                "experience": p.experience,
                "hourly_rate": p.hourly_rate,
                "rating": p.average_rating,
                "verified": p.is_verified,
                "category_id": p.category_id,
                "category_name": p.category.name if p.category else None,
            }
            for p in providers
        ]
    })