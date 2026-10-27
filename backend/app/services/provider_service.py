from flask_jwt_extended import get_jwt_identity

from app.models.service_provider import ServiceProvider
from app.repository.provider_repository import ProviderRepository
from app.repository.category_repository import CategoryRepository

class ProviderService:

    @staticmethod
    def create(data):

        if ProviderRepository.get_by_user_id(data["user_id"]):
            return {
                "success": False,
                "message": "Provider profile already exists"
            }

        category = CategoryRepository.get_by_id(data["category_id"])

        if not category:
            return {
                "success": False,
                "message": "Invalid category"
            }

        provider = ServiceProvider(
            user_id=data["user_id"],
            category_id=data["category_id"],
            business_name=data["business_name"],
            bio=data.get("bio"),
            experience=data.get("experience", 0),
            hourly_rate=data.get("hourly_rate"),
            phone=data.get("phone"),
            address=data.get("address"),
            city=data.get("city"),
            state=data.get("state"),
            pincode=data.get("pincode")
        )

        ProviderRepository.create(provider)

        return {
            "success": True,
            "message": "Provider profile created successfully",
            "provider_id": provider.id
        }

    @staticmethod
    def get_all():
        return ProviderRepository.get_all()

    @staticmethod
    def get_by_id(provider_id):
        return ProviderRepository.get_by_id(provider_id)

    @staticmethod
    def update(provider_id, data):

        provider = ProviderRepository.get_by_id(provider_id)

        if not provider:
            return {
                "success": False,
                "message": "Provider not found"
            }

        # Ownership check
        user_id = int(get_jwt_identity())

        if provider.user_id != user_id:
            return {
                "success": False,
                "message": "You are not authorized to update this profile"
            }

        provider.business_name = data.get("business_name", provider.business_name)
        provider.bio = data.get("bio", provider.bio)
        provider.experience = data.get("experience", provider.experience)
        provider.hourly_rate = data.get("hourly_rate", provider.hourly_rate)
        provider.phone = data.get("phone", provider.phone)
        provider.address = data.get("address", provider.address)
        provider.city = data.get("city", provider.city)
        provider.state = data.get("state", provider.state)
        provider.pincode = data.get("pincode", provider.pincode)

        ProviderRepository.update()

        return {
            "success": True,
            "message": "Provider updated successfully"
        }

    @staticmethod
    def delete(provider_id):

        provider = ProviderRepository.get_by_id(provider_id)

        if not provider:
            return {
                "success": False,
                "message": "Provider not found"
            }

        # Ownership check
        user_id = int(get_jwt_identity())

        if provider.user_id != user_id:
            return {
                "success": False,
                "message": "You are not authorized to delete this profile"
            }

        ProviderRepository.delete(provider)

        return {
            "success": True,
            "message": "Provider deleted successfully"
        }
