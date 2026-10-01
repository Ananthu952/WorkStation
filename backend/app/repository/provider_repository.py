from app.models.service_provider import ServiceProvider
from app.extensions import db


class ProviderRepository:

    @staticmethod
    def create(provider):
        db.session.add(provider)
        db.session.commit()
        return provider

    @staticmethod
    def get_by_id(provider_id):
        return ServiceProvider.query.get(provider_id)

    @staticmethod
    def get_by_user_id(user_id):
        return ServiceProvider.query.filter_by(user_id=user_id).first()

    @staticmethod
    def get_all():
        return ServiceProvider.query.all()

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(provider):
        db.session.delete(provider)
        db.session.commit()