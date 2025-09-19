import json
from datetime import datetime, timedelta
import random

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        origin = body.get("origin")
        destination = body.get("destination")
        departure_date = body.get("departureDate")
        return_date = body.get("returnDate")
        passengers = body.get("passengers", 1)

        if not origin or not destination or not departure_date:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        flights = generate_mock_flights(origin, destination, departure_date, return_date, passengers)

        return {
            "statusCode": 200,
            "body": json.dumps({"flights": flights})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def generate_mock_flights(origin, destination, departure_date, return_date, passengers):
    airlines = ["Caylent Air", "Lambda Express", "FlyGenAI", "NoServer Airlines"]
    base_price = random.randint(100, 300)
    results = []

    for i in range(3):
        flight = {
            "flightNumber": f"{random.choice(airlines)[:2].upper()}{random.randint(100,999)}",
            "airline": random.choice(airlines),
            "origin": origin,
            "destination": destination,
            "departureTime": departure_date + "T0{}:00:00".format(8 + i),
            "arrivalTime": departure_date + "T{}:00:00".format(12 + i),
            "returnDate": return_date + "T0{}:00:00".format(8 + i),
            "priceUSD": base_price + i * 25,
            "passengers": passengers
        }
        results.append(flight)

    return results
