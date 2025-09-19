import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

bedrock = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION", "us-east-1"))

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        logger.info(f"Received body: {body}")

        # Validate input
        required_fields = ["destination", "startDate", "endDate"]
        for field in required_fields:
            if field not in body:
                return error_response(f"Missing required field: {field}", 400)

        destination = body["destination"]
        start_date = body["startDate"]
        end_date = body["endDate"]
        passengers = body.get("passengers", 1)
        adventurousness = body.get("adventurousness", 5)

        prompt = build_prompt(destination, start_date, end_date, passengers, adventurousness)
        logger.info(f"Prompt sent to Bedrock:\n{prompt}")

        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 2400,
                "temperature": 0.7
            })
        )

        model_output = json.loads(response["body"].read().decode("utf-8"))
        logger.info(f"Model output: {model_output}")

        raw_text = model_output["content"][0]["text"]
        itinerary = extract_json_from_text(raw_text)

        return {
            "statusCode": 200,
            "body": json.dumps({"itinerary": itinerary})
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        fallback = fallback_itinerary()
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e),
                "fallback": fallback
            })
        }

def build_prompt(destination, start_date, end_date, passengers, adventurousness):
    return f"""
You are a travel planner AI. A group of {passengers} passengers is traveling to {destination}
from {start_date} to {end_date}. Their adventurousness level is {adventurousness}/10.

Create a JSON itinerary where each day includes:
- day (number),
- title (short summary),
- description (1 sentence max)
- highlights (list of attractions or activities in 1–2 short phrases)

Keep output concise. Respond ONLY with a valid JSON array. No markdown, no explanation.
"""

def extract_json_from_text(output):
    try:
        start = output.find("[")
        end = output.rfind("]") + 1
        json_str = output[start:end]
        return json.loads(json_str)
    except Exception as e:
        logger.warning("Claude output was cut off or malformed.")
        return fallback_itinerary()

def fallback_itinerary():
    return [
        {
            "day": 1,
            "title": "Arrival and City Walk",
            "description": "Arrive and explore the nearby landmarks.",
            "highlights": ["City Center", "Local Market", "Historic Bridge"]
        },
        {
            "day": 2,
            "title": "Cultural Day",
            "description": "Visit museums and engage with local culture.",
            "highlights": ["Art Museum", "Old Town", "Traditional Café"]
        }
    ]

def error_response(message, code=400):
    return {
        "statusCode": code,
        "body": json.dumps({"error": message})
    }
