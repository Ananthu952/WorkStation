"""
One-off script to promote an existing user to "admin".

There is intentionally no way to self-register as admin through the public
sign-up form (that would be a security hole) — admin accounts should always
be created this way: by someone with direct backend/database access.

Usage:
  1. Register a normal account first through the website (any email works,
     including a Gmail address — it's just treated as a string).
  2. Edit EMAIL below to match that account.
  3. Run from the backend root (with your venv activated):
       python promote_to_admin.py
"""

from app import create_app
from app.extensions import db
from app.models.user import User

# ---- EDIT THIS ----
EMAIL = "admin@gmail.com"
# --------------------

app = create_app()

with app.app_context():
    user = User.query.filter_by(email=EMAIL).first()

    if not user:
        print(f"No user found with email: {EMAIL}")
    else:
        user.role = "admin"
        db.session.commit()
        print(f"Updated {user.email} -> role: {user.role}")
