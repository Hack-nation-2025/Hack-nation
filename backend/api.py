# api.py

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS is needed to allow your React frontend to call this backend.
CORS(app)

# --- Endpoint 1: Get Test Categories (Optional but good to have) ---
@app.route('/categories', methods=['GET'])
def get_categories():
    """
    Returns a static list of available test categories for the frontend.
    """
    return jsonify([
        {"id": "prompt_injection", "label": "Prompt Injection"},
        {"id": "malformed_json", "label": "Malformed JSON"},
        {"id": "unicode_attacks", "label": "Unicode Attacks"},
        {"id": "long_inputs", "label": "Long Inputs"},
        {"id": "mixed_languages", "label": "Mixed Languages"},
        {"id": "contradictory_instructions", "label": "Contradictory Instructions"}
    ])

# --- Endpoint 2: Receive Test Configuration ---
@app.route('/run', methods=['POST'])
def run_tests_endpoint():
    """
    Receives the configuration from the frontend, prints it to the console,
    and returns a success message. This is the endpoint we'll use for testing.
    """
    data = request.json
    
    # --- THIS IS THE KEY PART FOR YOUR TEST ---
    # We will check the backend terminal for this printout.
    print("\n✅ --- Request Received from Frontend! ---")
    print(f"  Model URL: {data.get('model_url')}")
    print(f"  API Key: {'(hidden)' if data.get('api_key') else 'None'}")
    print(f"  Selected Categories: {data.get('categories')}")
    print(f"  Number of Tests: {data.get('totalTests')}")
    print("-------------------------------------------\n")
    # --- END OF KEY PART ---

    # Send a simple success response back to the frontend.
    return jsonify({
        "message": "Backend successfully received the configuration!",
        "data_received": data 
    })

if __name__ == '__main__':
    # Runs the Flask app on localhost, port 5001
    # The 'debug=True' part is very helpful for development.
    app.run(debug=True, port=5001)