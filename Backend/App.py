from flask import Flask, request, jsonify
from models import db, DeliveryRequest, DeliveryStatus, User, UserRole

app = Flask(__name__)
# Update connection string with your actual local or cloud PostgreSQL database credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/reflex_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/api/deliveries', methods=['GET'])
def get_all_deliveries():
    """Returns all requests for real-time dashboard polling sweeps."""
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
