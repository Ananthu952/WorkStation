from app.models.service_category import ServiceCategory
from app.extensions import db


class CategoryRepository:

    @staticmethod
    def get_all():
        return ServiceCategory.query.all()

    @staticmethod
    def get_by_id(category_id):
        return ServiceCategory.query.get(category_id)

    @staticmethod
    def get_by_name(name):
        return ServiceCategory.query.filter_by(name=name).first()

    @staticmethod
    def create(category):
        db.session.add(category)
        db.session.commit()
        return category

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(category):
        db.session.delete(category)
        db.session.commit()