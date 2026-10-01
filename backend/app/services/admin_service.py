from app.extensions import db
from app.models import User, ServiceProvider, Work
from app.models.provider_application import ProviderApplication


class AdminService:

    @staticmethod
    def get_stats():
        return {
            "total_users": User.query.count(),
            "total_providers": ServiceProvider.query.count(),
            "total_works": Work.query.count(),
            "pending_applications": ProviderApplication.query.filter_by(status="pending").count(),
        }

    @staticmethod
    def get_all_users():
        return User.query.order_by(User.id.desc()).all()

    @staticmethod
    def suspend_user(user_id):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        user.is_active = False
        db.session.commit()

        return {"success": True, "message": "User suspended"}

    @staticmethod
    def reactivate_user(user_id):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        user.is_active = True
        db.session.commit()

        return {"success": True, "message": "User reactivated"}
