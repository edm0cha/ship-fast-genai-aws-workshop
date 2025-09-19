# backend/tests/test_itinerary_lambda.py

import json
import pytest
from backend.itineraryLambda.handler import (
    build_prompt,
    extract_json_from_text,
    fallback_itinerary,
    lambda_handler
)

# A sample valid event
def make_event(
    destination="Paris",
    startDate="2025-10-01",
    endDate="2025-10-05",
    passengers=2,
    adventurousness=7
):
    return {
        "body": json.dumps({
            "destination": destination,
            "startDate": startDate,
            "endDate": endDate,
            "passengers": passengers,
            "adventurousness": adventurousness
        })
    }, None  # context is None for tests

def test_build_prompt():
    prompt = build_prompt("Tokyo", "2025-11-01", "2025-11-07", 3, 9)
    assert "Tokyo" in prompt
    assert "adventurousness" in prompt

def test_extract_json_from_valid_text():
    sample_json = "[{\"day\":1,\"title\":\"Test\",\"description\":\"Desc\",\"highlights\":[\"A\",\"B\"]}]"
    out = extract_json_from_text(sample_json)
    assert isinstance(out, list)
    assert out[0]["day"] == 1

def test_extract_json_from_malformed_text():
    malformed = "Some text not JSON"
    with pytest.raises(ValueError):
        extract_json_from_text(malformed)

def test_fallback_itinerary():
    fb = fallback_itinerary()
    assert isinstance(fb, list)
    assert fb and "day" in fb[0]

@pytest.mark.skip(reason="Needs AWS and bedrock; skip in pure local test")
def test_lambda_handler_success(monkeypatch):
    # Monkeypatch the bedrock.invoke_model inside handler to return a mock response
    def fake_invoke_model(*args, **kwargs):
        class FakeResp:
            def __init__(self):
                self.body = FakeBody()

        class FakeBody:
            def read(self_inner):
                # Return a mock body with correct structure
                content = {
                    "content": [
                        {
                            "type": "text",
                            "text": "[{\"day\":1,\"title\":\"Mock\",\"description\":\"Desc\",\"highlights\":[\"X\",\"Y\"]}]"
                        }
                    ]
                }
                return json.dumps(content).encode("utf-8")

        return FakeResp()

    import backend.itineraryLambda.handler as handler_mod

    monkeypatch.setattr(handler_mod.bedrock, "invoke_model", fake_invoke_model)

    event, ctx = make_event()
    resp = handler_mod.lambda_handler(event, ctx)
    assert resp["statusCode"] == 200
    body = json.loads(resp["body"])
    assert "itinerary" in body
    assert isinstance(body["itinerary"], list)
