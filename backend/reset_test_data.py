import argparse

from sqlalchemy import text

from app import app, db
from models import DeliveryRequest, User, UserRole


def reset_test_data():
    with app.app_context():
        db.create_all()
        db.session.query(DeliveryRequest).delete(synchronize_session=False)
        db.session.commit()

        if db.engine.dialect.name == "postgresql":
            db.session.execute(text("ALTER SEQUENCE delivery_requests_id_seq RESTART WITH 1"))
            db.session.commit()

        riders = User.query.filter_by(role=UserRole.RIDER).order_by(User.id).all()
        print("Cleared all delivery test data. User and rider records were preserved.")
        for rider in riders:
            print(f"Rider ID {rider.id}: {rider.name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clear deliveries while preserving user and rider IDs.")
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Required confirmation before deleting delivery records.",
    )
    args = parser.parse_args()

    if not args.confirm:
        parser.error("refusing to delete data without --confirm")

    reset_test_data()
