from datetime import datetime
from app.extensions import db


class Work(db.Model):
    __tablename__ = "works"

    id = db.Column(db.Integer, primary_key=True)

    client_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("service_categories.id"),
        nullable=False
    )

    title = db.Column(db.String(200), nullable=False)

    description = db.Column(db.Text)

    budget = db.Column(db.Float)

    deadline = db.Column(db.Date)

    status = db.Column(db.String(30), default="open")

    photo_urls = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    client = db.relationship(
        "User",
        back_populates="works"
    )

    category = db.relationship(
        "ServiceCategory",
        back_populates="works"
    )

    biddings = db.relationship(
        "Bidding",
        back_populates="work",
        cascade="all, delete"
    )