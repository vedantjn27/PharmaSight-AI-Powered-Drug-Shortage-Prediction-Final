import requests

BASE_URL = "http://127.0.0.1:8000"

endpoints = [
    ("GET", "/"),
    ("GET", "/health"),
    ("GET", "/api/v1/drugs"),
    ("GET", "/api/v1/forecast/Amoxicillin"),
    ("POST", "/api/v1/forecast/simulate", {"drug_name": "Amoxicillin", "simulated_cdsco_alerts": 5}),
    ("GET", "/api/v1/explain/Amoxicillin"),
    ("GET", "/api/v1/network"),
    ("POST", "/api/v1/network/simulate_disruption", {"offline_nodes": ["MFG_14"]}),
    ("GET", "/api/v1/purchase_orders")
]

print("--- Testing FastAPI Endpoints ---")
for method, url, *body in endpoints:
    full_url = f"{BASE_URL}{url}"
    try:
        if method == "GET":
            response = requests.get(full_url)
        else:
            payload = body[0] if body else {}
            response = requests.post(full_url, json=payload)
        
        status = response.status_code
        print(f"[{status}] {method} {url} -> {str(response.json())[:100]}...")
    except Exception as e:
        print(f"[FAIL] {method} {url} -> Error: {e}")
