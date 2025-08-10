# conftest.py

import pytest
import requests

def get_llm_client(target_url: str, api_key: str = None):
    """
    Creates an LLM client function for the given target URL and API key.
    
    Args:
        target_url: The URL of the LLM API endpoint
        api_key: Optional API key for authentication
        
    Returns:
        A function that can be called with a prompt to get an LLM response
    """
    # Create a session for connection pooling and performance
    session = requests.Session()
    
    if api_key:
        session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })
    else:
        session.headers.update({
            "Content-Type": "application/json",
        })

    def call_llm(prompt: str):
        """Sends a prompt to the LLM and returns the response text."""
        # Check if we're using a mock URL
        if "YOUR_LLM_API_ENDPOINT_HERE" in target_url or not target_url.startswith("http"):
            # This is a mock response for when the user hasn't configured a URL.
            # It helps us test the harness without a live API.
            print(f"\n[MOCK] Calling LLM with prompt: '{prompt[:50]}...'")
            if "joke" in prompt:
                return "Why don't scientists trust atoms? Because they make up everything!"
            if "photosynthesis" in prompt:
                return "Photosynthesis is a process used by plants."
            return "This is a default mock response."

        try:
            response = session.post(target_url, json={"prompt": prompt}, timeout=10)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
            return response.json().get("response", "")
        except requests.Timeout:
            return "Error: API call timed out."
        except requests.RequestException as e:
            return f"Error: API call failed: {e}"

    return call_llm

@pytest.fixture(scope="session")
def llm_client():
    """
    A pytest fixture that sets up a session to communicate with the target LLM.
    
    This is where the user's Target URL and API Key will be used.
    For now, we use placeholders.
    """
    # TODO: These will be loaded from the UI in the final app.
    # For now, you can set them as environment variables or hardcode for testing.
    TARGET_URL = "YOUR_LLM_API_ENDPOINT_HERE"
    API_KEY = "YOUR_API_KEY_HERE"

    return get_llm_client(TARGET_URL, API_KEY)