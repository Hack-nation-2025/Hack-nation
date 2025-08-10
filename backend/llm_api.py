import requests

class LLMClient:
    def __init__(self, target_url: str, api_key: str):
        self.target_url = target_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })

    def call_llm(self, prompt: str) -> str:
        try:
            response = self.session.post(self.target_url, json={"prompt": prompt}, timeout=10)
            response.raise_for_status()
            return response.json().get("response", "")
        except requests.Timeout:
            return "Error: API call timed out."
        except requests.RequestException as e:
            return f"Error: API call failed: {e}"