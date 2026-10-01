from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.category_service import CategoryService
from app.utils.role_required import role_required

category_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/v1/categories"
)


# -----------------------
# Get All Categories
# -----------------------
@category_bp.get("/")
def get_categories():

    categories = CategoryService.get_all()

    data = []

    for category in categories:
        data.append({
            "id": category.id,
            "name": category.name,
            "description": category.description
        })

    return jsonify({
        "success": True,
        "categories": data
    })


# -----------------------
# Create Category
# -----------------------
@category_bp.post("/")
@jwt_required()
@role_required("admin")
def create_category():

    data = request.get_json()

    result = CategoryService.create(data)

    status = 201 if result["success"] else 400

    return jsonify(result), status


# -----------------------
# Get Category By ID
# -----------------------
@category_bp.get("/<int:category_id>")
def get_category(category_id):

    category = CategoryService.get_by_id(category_id)

    if not category:
        return jsonify({
            "success": False,
            "message": "Category not found"
        }), 404

    return jsonify({
        "success": True,
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description
        }
    })


# -----------------------
# Update Category
# -----------------------
@category_bp.put("/<int:category_id>")
@jwt_required()
@role_required("admin")
def update_category(category_id):

    data = request.get_json()

    result = CategoryService.update(category_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


# -----------------------
# Delete Category
# -----------------------
@category_bp.delete("/<int:category_id>")
@jwt_required()
@role_required("admin")
def delete_category(category_id):

    result = CategoryService.delete(category_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status