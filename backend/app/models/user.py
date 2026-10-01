from datetime import datetime
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    fullname = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    phone = db.Column(db.String(20))

    role = db.Column(db.String(20), nullable=False, default="client")

    is_active = db.Column(db.Boolean, default=True)

    address = db.Column(db.String(255), nullable=True)

    email_notifications = db.Column(db.Boolean, default=True)

    sms_notifications = db.Column(db.Boolean, default=False)

    push_notifications = db.Column(db.Boolean, default=True)

    marketing_emails = db.Column(db.Boolean, default=False)

    status = db.Column(db.String(20), default="active")

    avatar_url = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    provider = db.relationship(
        "ServiceProvider",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )

    works = db.relationship(
        "Work",
        back_populates="client",
        cascade="all, delete"
    )

    def __repr__(self):
        return f"<User {self.email}>"