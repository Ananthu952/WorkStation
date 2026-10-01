from flask import Blueprint, request, jsonify
from app.services.work_service import WorkService
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from app.utils.role_required import role_required

work_bp = Blueprint(
    "works",
    __name__,
    url_prefix="/api/v1/works"
)


@work_bp.post("/")
@jwt_required()
@role_required("client")
def create_work():

    data = request.get_json()

    data["client_id"] = int(get_jwt_identity())

    result = WorkService.create(data)

    status = 201 if result["success"] else 400

    return jsonify(result), status

@work_bp.get("/")
def get_works():

    works = WorkService.get_all()

    return jsonify({
        "success": True,
        "works": [
            {
                "id": work.id,
                "title": work.title,
                "budget": work.budget,
                "status": work.status,
                "deadline": work.deadline,
                "category_id": work.category_id,
                "client_id": work.client_id
            }
            for work in works
        ]
    })


@work_bp.get("/<int:work_id>")
def get_work(work_id):

    work = WorkService.get_by_id(work_id)

    if not work:
        return jsonify({
            "success": False,
            "message": "Work not found"
        }), 404

    return jsonify({
        "success": True,
        "work": {
            "id": work.id,
            "title": work.title,
            "description": work.description,
            "budget": work.budget,
            "deadline": work.deadline,
            "status": work.status,
            "client_id": work.client_id,
            "category_id": work.category_id
        }
    })
@work_bp.put("/<int:work_id>")
def update_work(work_id):

    data = request.get_json()

    result = WorkService.update(work_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


@work_bp.delete("/<int:work_id>")
def delete_work(work_id):

    result = WorkService.delete(work_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status