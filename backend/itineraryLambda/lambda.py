import json
import boto3
import os
from datetime import datetime, timedelta

# Example uses Anthropic Claude via Bedrock – adjust if using another model
bedrock = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION", "us-east-1"))

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        destination = body.get("destination")
        start_date = body.get("startDate")
        end_date = body.get("endDate")
        passengers = body.get("passengers", 1)
        adventurousness = body.get("adventurousness", 5)

        if not destination or not start_date or not end_date:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        prompt = build_prompt(destination, start_date, end_date, passengers, adventurousness)

        response = bedrock.invoke_model(
            modelId = "anthropic.claude-3-haiku-20240307-v1:0",
            contentType = "application/json",
            accept = "application/json",
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "messages": [
                    {
                        "role": "user",
                        "content": build_prompt(destination, start_date, end_date, passengers, adventurousness)
                    }
                ],
                "max_tokens": 800,
                "temperature": 0.7
            })
        )
        model_output = json.loads(response["body"].read().decode("utf-8"))
        itinerary = json.loads(model_output["content"][0]["text"])

        return {
            "statusCode": 200,
            "body": json.dumps({"itinerary": itinerary})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def build_prompt(destination, start_date, end_date, passengers, adventurousness):
    return f"""
You are a travel planner AI. A group of {passengers} passengers is traveling to {destination}
from {start_date} to {end_date}. Their adventurousness level is {adventurousness}/10.

Create a JSON itinerary where each day includes:
- day (number),
- title (short summary),
- description (1–2 sentences),
- highlights (list of attractions or activities)

Respond ONLY with a valid JSON array. No markdown, no explanation.
"""

def extract_json_from_claude(output):
    try:
        # Extract JSON from Claude-style output (which may include ```json formatting)
        start = output.find("[")
        end = output.rfind("]") + 1
        json_str = output[start:end]
        return json.loads(json_str)
    except:
        return [{"error": "Unable to parse model output"}]
