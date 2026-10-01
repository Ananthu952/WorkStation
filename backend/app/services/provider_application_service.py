from app.extensions import db
from app.models.provider_application import ProviderApplication
from app.models.user import User
from app.services.provider_service import ProviderService


class ProviderApplicationService:

    @staticmethod
    def create(data):
        application = ProviderApplication(
            user_id=data["user_id"],
            category_id=data["category_id"],
            business_name=data["business_name"],
            experience=data["experience"],
            phone=data["phone"],
            address=data["address"],
            government_id=data["government_id"],
            license_number=data.get("license_number"),
            skills=data.get("skills"),
            availability=data["availability"],
            hourly_rate=data["hourly_rate"],
        )

        db.session.add(application)
        db.session.commit()

        return {
            "success": True,
            "message": "Application submitted",
            "application_id": application.id,
        }

    @staticmethod
    def get_all(status=None):
        query = ProviderApplication.query
        if status:
            query = query.filter_by(status=status)
        return query.order_by(ProviderApplication.id.desc()).all()

    @staticmethod
    def get_by_id(application_id):
        return ProviderApplication.query.get(application_id)

    @staticmethod
    def get_by_user(user_id):
        return (
            ProviderApplication.query
            .filter_by(user_id=user_id)
            .order_by(ProviderApplication.id.desc())
            .first()
        )

    @staticmethod
    def approve(application_id):
        application = ProviderApplication.query.get(application_id)

        if not application:
            return {"success": False, "message": "Application not found"}

        if application.status != "pending":
            return {"success": False, "message": "Application already processed"}

        user = User.query.get(application.user_id)
        user.role = "provider"

        application.status = "approved"
        db.session.commit()

        provider_result = ProviderService.create({
            "user_id": user.id,
            "business_name": application.business_name,
            "bio": "",
            "experience": application.experience,
            "hourly_rate": application.hourly_rate,
            "phone": application.phone,
            "city": "",
            "state": "",
            "category_id": application.category_id,
        })

        return {
            "success": True,
            "message": "Application approved",
            "provider": provider_result,
        }

    @staticmethod
    def reject(application_id):
        application = ProviderApplication.query.get(application_id)

        if not application:
            return {"success": False, "message": "Application not found"}

        application.status = "rejected"
        db.session.commit()

        return {"success": True, "message": "Application rejected"}
