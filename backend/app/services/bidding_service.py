from flask_jwt_extended import get_jwt_identity

from app.models.bidding import Bidding
from app.repository.bidding_repository import BiddingRepository
from app.repository.provider_repository import ProviderRepository
from app.repository.work_repository import WorkRepository


class BiddingService:

    @staticmethod
    def create(data):

        provider = ProviderRepository.get_by_id(data["provider_id"])

        if not provider:
            return {
                "success": False,
                "message": "Invalid provider"
            }

        work = WorkRepository.get_by_id(data["work_id"])

        if not work:
            return {
                "success": False,
                "message": "Invalid work"
            }

        if work.status != "open":
            return {
                "success": False,
                "message": "Bidding is closed for this work"
            }

        bid = Bidding(
            work_id=data["work_id"],
            provider_id=data["provider_id"],
            amount=data["amount"],
            message=data.get("message")
        )

        BiddingRepository.create(bid)

        return {
            "success": True,
            "message": "Bid submitted successfully",
            "bid_id": bid.id
        }

    @staticmethod
    def get_all():
        return BiddingRepository.get_all()

    @staticmethod
    def get_by_id(bid_id):
        return BiddingRepository.get_by_id(bid_id)

    @staticmethod
    def update(bid_id, data):

        bid = BiddingRepository.get_by_id(bid_id)

        if not bid:
            return {
                "success": False,
                "message": "Bid not found"
            }

        # Ownership check
        provider = ProviderRepository.get_by_user_id(
            int(get_jwt_identity())
        )

        if not provider or bid.provider_id != provider.id:
            return {
                "success": False,
                "message": "You are not authorized to update this bid"
            }

        bid.amount = data.get("amount", bid.amount)
        bid.message = data.get("message", bid.message)

        BiddingRepository.update()

        return {
            "success": True,
            "message": "Bid updated successfully"
        }

    @staticmethod
    def delete(bid_id):

        bid = BiddingRepository.get_by_id(bid_id)

        if not bid:
            return {
                "success": False,
                "message": "Bid not found"
            }

        # Ownership check
        provider = ProviderRepository.get_by_user_id(
            int(get_jwt_identity())
        )

        if not provider or bid.provider_id != provider.id:
            return {
                "success": False,
                "message": "You are not authorized to delete this bid"
            }

        BiddingRepository.delete(bid)

        return {
            "success": True,
            "message": "Bid deleted successfully"
        }

    @staticmethod
    def accept_bid(bid_id):

        bid = BiddingRepository.get_by_id(bid_id)

        if not bid:
            return {
                "success": False,
                "message": "Bid not found"
            }

        work = WorkRepository.get_by_id(bid.work_id)

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
                "message": "You are not authorized to accept this bid"
            }

        if work.status != "open":
            return {
                "success": False,
                "message": "Work is already assigned"
            }

        bid.status = "accepted"
        work.status = "assigned"

        all_bids = BiddingRepository.get_by_work_id(work.id)

        for b in all_bids:
            if b.id != bid.id:
                b.status = "rejected"

        BiddingRepository.update()
        WorkRepository.update()

        return {
            "success": True,
            "message": "Bid accepted successfully"
        }