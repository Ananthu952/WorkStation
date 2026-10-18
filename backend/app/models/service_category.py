from app.extensions import db

class ServiceCategory(db.Model):
    __tablename__ = "service_categories"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False, unique=True)

    description = db.Column(db.Text)

    providers = db.relationship(
        "ServiceProvider",
        back_populates="category"
    )

    works = db.relationship(
        "Work",
        back_populates="category"
    )

    def __repr__(self):
        return f"<Category {self.name}>"
