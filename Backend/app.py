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
