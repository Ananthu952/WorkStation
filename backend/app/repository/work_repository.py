from app.models.work import Work
from app.extensions import db


class WorkRepository:

    @staticmethod
    def create(work):
        db.session.add(work)
        db.session.commit()
        return work

    @staticmethod
    def get_by_id(work_id):
        return Work.query.get(work_id)

    @staticmethod
    def get_all():
        return Work.query.all()

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(work):
        db.session.delete(work)
        db.session.commit()