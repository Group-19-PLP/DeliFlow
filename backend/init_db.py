import os
from app import app, db
from models import User, UserRole, DeliveryRequest, DeliveryStatus

def setup_and_seed_database():
    print("🚀 Initializing Reflex database management registry...")
    
    with app.app_context():
        # Drop all tables if they exist to provide a completely clean testing canvas
        db.drop_all()
        db.create_all()
        print("📁 Database schema tables successfully mapped.")

        # Seed Mock User Persona Profiles
        retailer = User(name="Moi Electronics Hub", phone="0711223344", role=UserRole.RETAILER)
        dispatcher = User(name="Central Dispatch Controller", phone="0722334455", role=UserRole.DISPATCHER)
        rider_1 = User(name="Rider Juma (Boda 442)", phone="0733445566", role=UserRole.RIDER)
        rider_2 = User(name="Rider Kamau (Boda 109)", phone="0744556677", role=UserRole.RIDER)

        db.session.add_all([retailer, dispatcher, rider_1, rider_2])
        db.session.commit()
        print("👥 Operational user profile seed data injected successfully.")

        # Seed a default active shipment queue entry for demo visibility
        mock_delivery = DeliveryRequest(
            retailer_id=retailer.id,
            customer_name="Mwangi Kamau",
            customer_phone="0755667788",
            delivery_address="Biashara Street, Nairobi CBD",
            item_description="Premium Android Smartphone Box",
            verification_code="RFX-900",
            status=DeliveryStatus.PENDING
        )
        
        db.session.add(mock_delivery)
        db.session.commit()
        print("📦 Active shipment queue entry seeded cleanly.")
        print("🏁 Database ready for localized endpoint execution!")

if __name__ == "__main__":
    setup_and_seed_database()
