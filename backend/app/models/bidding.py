from datetime import datetime
from app.extensions import db

class Bidding(db.Model):
    __tablename__ = "biddings"

    id = db.Column(db.Integer, primary_key=True)

    work_id = db.Column(
        db.Integer,
        db.ForeignKey("works.id"),
        nullable=False
    )

    provider_id = db.Column(
        db.Integer,
        db.ForeignKey("service_providers.id"),
        nullable=False
    )

    amount = db.Column(db.Float, nullable=False)

    message = db.Column(db.Text)

    status = db.Column(db.String(30), default="pending")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    work = db.relationship(
        "Work",
        back_populates="biddings"
    )

    provider = db.relationship(
        "ServiceProvider",
        back_populates="biddings"
    )
