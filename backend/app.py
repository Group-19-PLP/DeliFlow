import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, DeliveryRequest, DeliveryStatus, User, UserRole

app = Flask(__name__)

# Configure database URI from environment (Render provides DATABASE_URL). Fall back to sqlite for local dev.
# Some platforms (older Heroku/Render) provide a postgres:// URL; SQLAlchemy requires postgresql:// for psycopg2.
db_uri = os.getenv("DATABASE_URL", os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///reflex_db.db"))
if isinstance(db_uri, str) and db_uri.startswith("postgres://"):
    db_uri = db_uri.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB
db.init_app(app)

# Enable CORS for all routes
CORS(app)

@app.route('/api/deliveries', methods=['GET', 'POST'])
def get_all_deliveries():
    """Returns all requests for real-time dashboard polling sweeps or creates new delivery."""
    if request.method == 'POST':
        data = request.get_json() or {}
        
        # Validate required fields
        required_fields = ['customer_name', 'customer_phone', 'delivery_address', 'item_description']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        try:
            # Get the retailer user (default to ID 1 for demo)
            retailer = User.query.filter_by(role=UserRole.RETAILER).first()
            if not retailer:
                return jsonify({"error": "No retailer user found"}), 400
            
            # Generate a simple verification code
            import random
            import string
            verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            new_delivery = DeliveryRequest(
                retailer_id=retailer.id,
                customer_name=data.get('customer_name'),
                customer_phone=data.get('customer_phone'),
                delivery_address=data.get('delivery_address'),
                item_description=data.get('item_description'),
                verification_code=verification_code,
                status=DeliveryStatus.PENDING
            )
            
            db.session.add(new_delivery)
            db.session.commit()
            
            return jsonify({
                "id": new_delivery.id,
                "customer_name": new_delivery.customer_name,
                "delivery_address": new_delivery.delivery_address,
                "status": new_delivery.status.value,
                "verification_code": verification_code,
                "rider_id": new_delivery.rider_id
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    
    # GET method
    requests = DeliveryRequest.query.order_by(DeliveryRequest.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "customer_name": r.customer_name,
        "delivery_address": r.delivery_address,
        "status": r.status.value,
        "rider_id": r.rider_id
    } for r in requests]), 200

@app.route('/api/deliveries/<int:request_id>/status', methods=['PATCH'])
def update_delivery_status(request_id):
    """Atomic endpoint handling sequential state modification shifts."""
    data = request.get_json() or {}
    new_status_str = data.get('status')
    
    if not new_status_str or new_status_str not in DeliveryStatus.__members__:
        return jsonify({"error": "Invalid status field value provided"}), 400
        
    delivery = DeliveryRequest.query.get_or_404(request_id)
    target_status = DeliveryStatus[new_status_str]
    
    try:
        # Executes the state machine guard logic created on Day 1
        delivery.update_status(target_status)
        db.session.commit()
        return jsonify({
            "message": "Status updated successfully", 
            "id": delivery.id, 
            "status": delivery.status.value
        }), 200
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422

@app.route('/api/deliveries/<int:request_id>/verify', methods=['POST'])
def verify_and_close_delivery(request_id):
    """Verifies scanning hash before closing delivery lifecycle records out securely."""
    data = request.get_json() or {}
    submitted_code = data.get('verification_code')
    
    if not submitted_code:
        return jsonify({"error": "Missing validation verification code confirmation entry"}), 400
        
    delivery = DeliveryRequest.query.get_or_404(request_id)
    
    # Security Rule Check: Block confirmation workflows if state is not currently picked up
    if delivery.status != DeliveryStatus.PICKED_UP:
        return jsonify({"error": "Package must be marked as PICKED_UP before confirmation validation runs"}), 422
        
    if delivery.verification_code.strip() != submitted_code.strip():
        return jsonify({"error": "Invalid verification token code security string failure matching"}), 403
        
    try:
        delivery.update_status(DeliveryStatus.DELIVERED)
        db.session.commit()
        return jsonify({
            "message": "Delivery successfully verified and completed.",
            "id": delivery.id,
            "status": delivery.status.value
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal ledger update crash error occurs"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
