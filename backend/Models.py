import enum
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class UserRole(enum.Enum):
    RETAILER = "RETAILER"
    DISPATCHER = "DISPATCHER"
    RIDER = "RIDER"

class DeliveryStatus(enum.Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    PICKED_UP = "PICKED_UP"
    DELIVERED = "DELIVERED"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)

class DeliveryRequest(db.Model):
    __tablename__ = 'delivery_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    delivery_address = db.Column(db.Text, nullable=False)
    item_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(DeliveryStatus), default=DeliveryStatus.PENDING, nullable=False)
    rider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    verification_code = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def update_status(self, new_status: DeliveryStatus):
        """Strict state machine logic to present to the examination panel."""
        allowed_transitions = {
            DeliveryStatus.PENDING: [DeliveryStatus.ASSIGNED],
            DeliveryStatus.ASSIGNED: [DeliveryStatus.PICKED_UP, DeliveryStatus.PENDING],
            DeliveryStatus.PICKED_UP: [DeliveryStatus.DELIVERED]
        }
        
        if self.status == new_status:
            return
            
        if new_status not in allowed_transitions.get(self.status, []):
            raise ValueError(f"Illegal state change from {self.status.value} to {new_status.value}")
            
        self.status = new_status
