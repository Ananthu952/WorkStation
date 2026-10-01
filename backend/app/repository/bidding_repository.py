from app.models.bidding import Bidding
from app.extensions import db


class BiddingRepository:

    @staticmethod
    def create(bid):
        db.session.add(bid)
        db.session.commit()
        return bid

    @staticmethod
    def get_by_id(bid_id):
        return Bidding.query.get(bid_id)

    @staticmethod
    def get_all():
        return Bidding.query.all()

    @staticmethod
    def get_by_work_id(work_id):
        return Bidding.query.filter_by(work_id=work_id).all()

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(bid):
        db.session.delete(bid)
        db.session.commit()