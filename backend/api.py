import subprocess
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from test_generators import GENERATOR_REGISTRY

app = Flask(__name__)
# CORS is needed to allow the frontend (running on a different port) to call the backend.
CORS(app)

# --- Endpoint 1: Get Test Categories ---
@app.route('/categories', methods=['GET'])
def get_categories():
    """
    Returns the list of available test categories from our generator registry.
    This lets the frontend build the checklist dynamically.
    """
    # We can expand this later to include descriptions from the original plan.
    category_list = [{"id": key, "label": key.replace('_', ' ').title()} for key in GENERATOR_REGISTRY.keys()]
    return jsonify(category_list)

# --- Endpoint 2: Run Tests ---
@app.route('/run', methods=['POST'])
def run_tests():
    """
    Receives test configuration, runs the pytest harness, and returns the results.
    """
    data = request.json
    selected_categories = data.get('categories', [])
    
    # In a real app, you would pass the target URL and API key to the harness.
    # For now, we'll just use the categories.
    
    # 1. Modify test_harness.py to accept categories as an argument or environment variable.
    #    For simplicity here, we'll dynamically write which categories to run.
    with open('test_harness.py', 'r') as f:
        harness_code = f.read()

    # Replace the hardcoded list of categories with the one from the request.
    # This is a simple way to do it for the hackathon; a real app might use command-line args.
    new_harness_code = harness_code.replace(
        'TEST_CATEGORIES = [\n    "malformed_json",\n    "contradictory_instructions",\n    "safety_policy",\n]',
        f'TEST_CATEGORIES = {json.dumps(selected_categories)}'
    )

    with open('temp_test_harness.py', 'w') as f:
        f.write(new_harness_code)

    # 2. Run pytest using a subprocess.
    try:
        # The command to run our tests and generate the JSON report
        command = [
            "pytest", 
            "temp_test_harness.py", 
            "--json-report", 
            "--json-report-file=results.json"
        ]
        subprocess.run(command, check=True, capture_output=True, text=True)
        
        # 3. Read the results file and send it back to the frontend.
        with open('results.json', 'r') as f:
            results = json.load(f)
            return jsonify(results)

    except subprocess.CalledProcessError as e:
        # If pytest fails, return an error message
        return jsonify({"error": "Error running tests", "details": e.stderr}), 500
    except FileNotFoundError:
        return jsonify({"error": "results.json not found. Did the tests run correctly?"}), 500

if __name__ == '__main__':
    # Runs the Flask app on localhost, port 5001
    app.run(debug=True, port=5001)