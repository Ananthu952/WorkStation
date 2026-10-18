import os 
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

upload_bp = Blueprint(
    "uploads",
    __name__,
    url_prefix="/api/v1/uploads"
)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.post("/")
@jwt_required()
def upload_file():

    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"success": False, "message": "No file selected"}), 400

    if not _allowed_file(file.filename):
        return jsonify({
            "success": False,
            "message": "Only png, jpg, jpeg, and webp files are allowed"
        }), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    safe_name = secure_filename(unique_name)

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, safe_name)
    file.save(filepath)

    # Served by the static route registered in __init__.py
    url = f"/uploads/{safe_name}"

    return jsonify({"success": True, "url": url}), 201
