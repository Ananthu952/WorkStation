from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.bidding_service import BiddingService
from app.repository.provider_repository import ProviderRepository
from app.utils.role_required import role_required

bidding_bp = Blueprint(
    "biddings",
    __name__,
    url_prefix="/api/v1/biddings"
)


# ----------------------------
# Create Bid
# ----------------------------
@bidding_bp.post("/")
@jwt_required()
@role_required("provider")
def create_bid():

    data = request.get_json()

    provider = ProviderRepository.get_by_user_id(
        int(get_jwt_identity())
    )

    if not provider:
        return jsonify({
            "success": False,
            "message": "Provider profile not found"
        }), 404

    data["provider_id"] = provider.id

    result = BiddingService.create(data)

    status = 201 if result["success"] else 400

    return jsonify(result), status


# ----------------------------
# Get All Bids
# ----------------------------
@bidding_bp.get("/")
def get_bids():

    bids = BiddingService.get_all()

    return jsonify({
        "success": True,
        "biddings": [
            {
                "id": bid.id,
                "work_id": bid.work_id,
                "provider_id": bid.provider_id,
                "amount": bid.amount,
                "message": bid.message,
                "status": bid.status
            }
            for bid in bids
        ]
    })


# ----------------------------
# Get Bid By ID
# ----------------------------
@bidding_bp.get("/<int:bid_id>")
def get_bid(bid_id):

    bid = BiddingService.get_by_id(bid_id)

    if not bid:
        return jsonify({
            "success": False,
            "message": "Bid not found"
        }), 404

    return jsonify({
        "success": True,
        "bidding": {
            "id": bid.id,
            "work_id": bid.work_id,
            "provider_id": bid.provider_id,
            "amount": bid.amount,
            "message": bid.message,
            "status": bid.status
        }
    })


# ----------------------------
# Update Bid
# ----------------------------
@bidding_bp.put("/<int:bid_id>")
@jwt_required()
def update_bid(bid_id):

    data = request.get_json()

    result = BiddingService.update(bid_id, data)

    status = 200 if result["success"] else 404

    return jsonify(result), status


# ----------------------------
# Delete Bid
# ----------------------------
@bidding_bp.delete("/<int:bid_id>")
@jwt_required()
def delete_bid(bid_id):

    result = BiddingService.delete(bid_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status


# ----------------------------
# Accept Bid
# ----------------------------
@bidding_bp.put("/<int:bid_id>/accept")
@jwt_required()
@role_required("client")
def accept_bid(bid_id):

    result = BiddingService.accept_bid(bid_id)

    status = 200 if result["success"] else 404

    return jsonify(result), status