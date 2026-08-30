import pytest
from app import app, db
from models import DeliveryRequest, DeliveryStatus, User, UserRole

@pytest.fixture
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Isolation test box database
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_enforce_strict_state_sequence(test_client):
    """Enforces that an order cannot jump from PENDING straight to DELIVERED."""
    with app.app_context():
        # Setup mock entities securely
        retailer = User(name="Test Retail Shop", phone="0711223344", role=UserRole.RETAILER)
        db.session.add(retailer)
        db.session.commit()
        
        request_obj = DeliveryRequest(
            retailer_id=retailer.id,
            customer_name="John Doe",
            customer_phone="0722334455",
            delivery_address="Moi Ave, Nairobi",
            item_description="Electronics Box",
            verification_code="RFX-900",
            status=DeliveryStatus.PENDING
        )
        db.session.add(request_obj)
        db.session.commit()

        # Execute an invalid status update attempt directly
        with pytest.raises(ValueError) as exc_info:
            request_obj.update_status(DeliveryStatus.DELIVERED)
            
        assert "Illegal state change" in str(exc_info.value)
