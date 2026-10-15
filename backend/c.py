"""
Diagnostic: lists every ProviderApplication row with its linked user's
email and current role, so we can see exactly which account got approved
and whether the role actually changed for that specific account.

Usage: python check_applications.py (from backend root, venv activated)
"""

from app import create_app
from app.models.provider_application import ProviderApplication
from app.models.user import User

app = create_app()

with app.app_context():
    applications = ProviderApplication.query.all()

    if not applications:
        print("No provider applications found.")

    for a in applications:
        user = User.query.get(a.user_id)
        print(
            f"Application #{a.id} | "
            f"user_id={a.user_id} | "
            f"email={user.email if user else 'USER NOT FOUND'} | "
            f"current role={user.role if user else '?'} | "
            f"application status={a.status}"
        )
        
