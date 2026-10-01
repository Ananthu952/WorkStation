from app.models.service_category import ServiceCategory
from app.repository.category_repository import CategoryRepository


class CategoryService:

    @staticmethod
    def get_all():
        return CategoryRepository.get_all()

    @staticmethod
    def get_by_id(category_id):
        return CategoryRepository.get_by_id(category_id)

    @staticmethod
    def create(data):

        if not data.get("name"):
            return {
                "success": False,
                "message": "Category name is required"
            }

        if CategoryRepository.get_by_name(data["name"]):
            return {
                "success": False,
                "message": "Category already exists"
            }

        category = ServiceCategory(
            name=data["name"],
            description=data.get("description")
        )

        CategoryRepository.create(category)

        return {
            "success": True,
            "message": "Category created successfully"
        }

    @staticmethod
    def update(category_id, data):

        category = CategoryRepository.get_by_id(category_id)

        if not category:
            return {
                "success": False,
                "message": "Category not found"
            }

        category.name = data.get("name", category.name)
        category.description = data.get("description", category.description)

        CategoryRepository.update()

        return {
            "success": True,
            "message": "Category updated successfully"
        }

    @staticmethod
    def delete(category_id):

        category = CategoryRepository.get_by_id(category_id)

        if not category:
            return {
                "success": False,
                "message": "Category not found"
            }

        CategoryRepository.delete(category)

        return {
            "success": True,
            "message": "Category deleted successfully"
        }