#!/usr/bin/env python3
"""
Simple script to test email notifications by calling the Supabase Edge Function
This can be used for testing the email notification system
"""

import requests
import json
import os
from datetime import datetime

# Configuration
SUPABASE_URL = "https://dtiijjkhpmehyinbvjrq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWlqamtocG1laHlpbmJ2anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDM4MzcsImV4cCI6MjA3MzQxOTgzN30.-628OUJt2Goxw9tQgqbvAmwUK9yQfT6THUOf1T-t56U"

def test_email_notification():
    """Test the email notification function"""
    
    # Sample order data
    test_order = {
        "orderId": f"TEST_{int(datetime.now().timestamp())}",
        "customerName": "Test Customer",
        "customerPhone": "+91 8124886893",
        "customerEmail": "test.customer@example.com",
        "products": [
            {
                "name": "Pure Water",
                "size": "20L Jar",
                "quantity": 2,
                "price": 120
            },
            {
                "name": "Pure Water", 
                "size": "1L Bottle (Case of 12)",
                "quantity": 1,
                "price": 300
            }
        ],
        "totalCost": 540,
        "deliveryAddress": "123 Test Street, Test City, Test State - 123456",
        "deliveryDate": "2025-09-15",
        "deliveryTime": "9 AM - 1 PM",
        "specialInstructions": "Please call before delivery",
        "serviceType": "Bulk Orders"
    }
    
    # Headers
    headers = {
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    # URL for the edge function
    url = f"{SUPABASE_URL}/functions/v1/send-admin-notification"
    
    print("🧪 Testing email notification system...")
    print(f"📧 Sending test order notification to: abdulkalam081998@gmail.com")
    print(f"🛒 Order ID: {test_order['orderId']}")
    print(f"💰 Total: ₹{test_order['totalCost']}")
    print("=" * 50)
    
    try:
        response = requests.post(url, headers=headers, json=test_order, timeout=30)
        
        print(f"📡 HTTP Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Email notification sent successfully!")
            print(f"📝 Response: {json.dumps(result, indent=2)}")
        else:
            print("❌ Email notification failed!")
            print(f"🔍 Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_email_notification()
