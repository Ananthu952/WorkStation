from app.extensions import db
from datetime import datetime


class ProviderApplication(db.Model):
    __tablename__ = "provider_applications"

    id = db.Column(db.Integer, primary_key=True)
    # CHANGED: "user.id" -> "users.id" to match the actual User table name.
    # If your User model's __tablename__ is something else entirely, adjust
    # this string to match exactly.
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("service_categories.id"), nullable=False)

    business_name = db.Column(db.String(120), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    government_id = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(100), nullable=True)
    skills = db.Column(db.String(255), nullable=True)  # comma-separated
    availability = db.Column(db.String(20), nullable=False)  # weekdays / weekends / flexible
    hourly_rate = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(20), default="pending")  # pending / approved / rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="provider_applications")
    category = db.relationship("ServiceCategory")