from flask import Flask
from flask_cors import CORS
import os
from flask import send_from_directory

from app.extensions import db, jwt, migrate
from app.utils.password import bcrypt
from app.routes.category_routes import category_bp
from app.routes.provider_routes import provider_bp
from app.routes.work_routes import work_bp
from app.routes.bidding_routes import bidding_bp
from app.routes.admin_routes import admin_bp
from app.routes.user_routes import user_bp
# Import models so Flask-Migrate (and db.create_all()) can detect them —
# ProviderApplication ADDED here so its table actually gets created.
from app.models import (
    User,
    ServiceCategory,
    ServiceProvider,
    Work,
    Bidding,
    ProviderApplication,
)


def create_app():
    app = Flask(__name__)

    # ===========================
    # Configuration
    # ===========================
    app.config["SECRET_KEY"] = "workstation-secret-key"
    app.config["JWT_SECRET_KEY"] = "workstation-jwt-secret"

    # SQLite Database
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///workstation.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["UPLOAD_FOLDER"] = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "uploads"
    )
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # ===========================
    # Initialize Extensions
    # ===========================
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    # ===========================
    # Register Blueprints
    # ===========================
    from app.routes.auth_routes import auth_bp
    from app.routes.upload_routes import upload_bp
    from app.routes.provider_application_routes import provider_application_bp

    app.register_blueprint(upload_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(provider_bp)
    app.register_blueprint(work_bp)
    app.register_blueprint(bidding_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(provider_application_bp)

    # ===========================
    # Home Route
    # ===========================
    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "🚀 WorkStation Refurbished Backend Running"
        }

    # Serves uploaded files — MOVED above return app, since code after
    # a return statement inside a function is never executed.
    @app.route("/uploads/<filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app