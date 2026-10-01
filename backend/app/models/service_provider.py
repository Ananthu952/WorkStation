from datetime import datetime
from app.extensions import db


class ServiceProvider(db.Model):
    __tablename__ = "service_providers"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("service_categories.id"),
        nullable=False
    )

    business_name = db.Column(db.String(150), nullable=False)

    bio = db.Column(db.Text)

    experience = db.Column(db.Integer, default=0)

    hourly_rate = db.Column(db.Float)

    phone = db.Column(db.String(20))

    address = db.Column(db.String(255))

    city = db.Column(db.String(100))

    state = db.Column(db.String(100))

    pincode = db.Column(db.String(20))

    profile_image = db.Column(db.String(255))

    is_verified = db.Column(db.Boolean, default=False)

    average_rating = db.Column(db.Float, default=0)

    total_reviews = db.Column(db.Integer, default=0)

    jobs_completed = db.Column(db.Integer, default=0)

    portfolio_urls = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationships
    user = db.relationship(
        "User",
        backref="provider_profile"
    )

    category = db.relationship(
        "ServiceCategory",
        back_populates="providers"
    )

    biddings = db.relationship(
        "Bidding",
        back_populates="provider",
        cascade="all, delete-orphan"
    )