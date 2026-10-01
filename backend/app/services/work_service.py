from datetime import datetime
from flask_jwt_extended import get_jwt_identity

from app.models.work import Work
from app.repository.work_repository import WorkRepository
from app.repository.category_repository import CategoryRepository


class WorkService:

    @staticmethod
    def create(data):

        category = CategoryRepository.get_by_id(data["category_id"])

        if not category:
            return {
                "success": False,
                "message": "Invalid category"
            }

        deadline = None
        if data.get("deadline"):
            deadline = datetime.strptime(
                data["deadline"],
                "%Y-%m-%d"
            ).date()

        work = Work(
            client_id=data["client_id"],
            category_id=data["category_id"],
            title=data["title"],
            description=data.get("description"),
            budget=data.get("budget"),
            deadline=deadline
        )

        WorkRepository.create(work)

        return {
            "success": True,
            "message": "Work created successfully",
            "work_id": work.id
        }

    @staticmethod
    def get_all():
        return WorkRepository.get_all()

    @staticmethod
    def get_by_id(work_id):
        return WorkRepository.get_by_id(work_id)

    @staticmethod
    def update(work_id, data):

        work = WorkRepository.get_by_id(work_id)

        if not work:
            return {
                "success": False,
                "message": "Work not found"
            }

        # Ownership check
        user_id = int(get_jwt_identity())

        if work.client_id != user_id:
            return {
                "success": False,
                "message": "You are not authorized to update this work"
            }

        work.title = data.get("title", work.title)
        work.description = data.get("description", work.description)
        work.budget = data.get("budget", work.budget)
        work.status = data.get("status", work.status)

        if data.get("deadline"):
            work.deadline = datetime.strptime(
                data["deadline"],
                "%Y-%m-%d"
            ).date()

        WorkRepository.update()

        return {
            "success": True,
            "message": "Work updated successfully"
        }

    @staticmethod
    def delete(work_id):

        work = WorkRepository.get_by_id(work_id)

        if not work:
            return {
                "success": False,
                "message": "Work not found"
            }

        # Ownership check
        user_id = int(get_jwt_identity())

        if work.client_id != user_id:
            return {
                "success": False,
                "message": "You are not authorized to delete this work"
            }

        WorkRepository.delete(work)

        return {
            "success": True,
            "message": "Work deleted successfully"
        }