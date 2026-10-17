"""
Quick diagnostic: prints the real role stored in the database for a given
user, bypassing the frontend/API entirely.
 
Usage:
  1. Edit EMAIL below.
  2. Run from backend root (venv activated): python check_user_role.py
"""

from app import create_app
from app.extensions import db
from app.models.user import User

EMAIL = "ananthus952@gmail.com"

app = create_app()

with app.app_context():
    user = User.query.filter_by(email=EMAIL).first()

    if not user:
        print(f"No user found with email: {EMAIL}")
    else:
        print(f"Email: {user.email}")
        print(f"Role in database: {user.role}")
