from app.extensions import db
from app.models.user import User
from app.utils.password import hash_password, check_password

class AuthService:

    @staticmethod
    def register(data):

        if User.query.filter_by(email=data["email"]).first():
            return {"success": False, "message": "Email already exists"}

        user = User(
            fullname=data["fullname"],
            email=data["email"],
            password=hash_password(data["password"]),
            phone=data.get("phone"),
            role=data.get("role", "client")
        )

        db.session.add(user)
        db.session.commit()

        return {"success": True, "message": "Registration successful"}

    @staticmethod
    def login(data):

        user = User.query.filter_by(email=data["email"]).first()

        if not user:
            return None

        if not check_password(data["password"], user.password):
            return None

        return user
