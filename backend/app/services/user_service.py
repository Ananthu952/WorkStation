from app.extensions import db
from app.models.user import User
from app.utils.password import hash_password, check_password

class UserService:

    @staticmethod
    def update_profile(user_id, data):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        if "fullname" in data:
            user.fullname = data["fullname"]
        if "phone" in data:
            user.phone = data["phone"]
        if "address" in data:
            user.address = data["address"]

        db.session.commit()

        return {
            "success": True,
            "user": {
                "id": user.id,
                "fullname": user.fullname,
                "email": user.email,
                "phone": user.phone,
                "address": user.address,
                "role": user.role,
            }
        }

    @staticmethod
    def change_password(user_id, data):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        if not check_password(data["currentPassword"], user.password):
            return {"success": False, "message": "Current password is incorrect"}

        user.password = hash_password(data["newPassword"])
        db.session.commit()

        return {"success": True, "message": "Password updated"}

    @staticmethod
    def update_notification_settings(user_id, data):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        if "emailNotifications" in data:
            user.email_notifications = data["emailNotifications"]
        if "smsNotifications" in data:
            user.sms_notifications = data["smsNotifications"]
        if "pushNotifications" in data:
            user.push_notifications = data["pushNotifications"]
        if "marketingEmails" in data:
            user.marketing_emails = data["marketingEmails"]

        db.session.commit()

        return {"success": True, "message": "Settings updated"}

    @staticmethod
    def get_settings(user_id):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        return {
            "success": True,
            "settings": {
                "emailNotifications": user.email_notifications,
                "smsNotifications": user.sms_notifications,
                "pushNotifications": user.push_notifications,
                "marketingEmails": user.marketing_emails,
            }
        }

    @staticmethod
    def delete_account(user_id):
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}

        # NOTE: if this user has related rows (Works, Biddings, a
        # ServiceProvider profile, ProviderApplications) and those foreign
        # keys aren't set up with ON DELETE CASCADE, this will raise an
        # IntegrityError. Test with a fresh account with no related data first.
        db.session.delete(user)
        db.session.commit()

        return {"success": True, "message": "Account deleted"}
