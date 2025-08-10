# api.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from stress_test_runners import LLMStressTester
from conftest import get_llm_client
import json

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
        {"id": "textual_adversarial", "label": "Sentence Relationship"},
        {"id": "mixed_languages", "label": "Mixed Languages"},
        {"id": "contradictory_instructions", "label": "Contradictory Instructions"}
    ])

# --- Endpoint 2: Run Stress Tests ---
@app.route('/run', methods=['POST'])
def run_tests_endpoint():
    """
    Receives the configuration from the frontend, runs stress tests,
    and returns the results with failure rate.
    """
    data = request.json
    
    print("\n✅ --- Request Received from Frontend! ---")
    print(f"  Model URL: {data.get('model_url')}")
    print(f"  API Key: {'(hidden)' if data.get('api_key') else 'None'}")
    print(f"  Selected Categories: {data.get('categories')}")
    print(f"  Number of Tests: {data.get('totalTests')}")
    print("-------------------------------------------\n")

    try:
        # Get the LLM client from conftest
        llm_client = get_llm_client(data.get('model_url'), data.get('api_key'))
        
        # Create stress tester
        tester = LLMStressTester(llm_client, max_workers=10)
        
        # Run basic stress test with selected categories
        categories = data.get('categories', [])
        samples_per_category = max(1, data.get('totalTests', 10) // len(categories)) if categories else 10
        
        print(f"Running stress test with {samples_per_category} samples per category...")
        
        # Run the stress test
        summary = tester.run_basic_stress_test(categories, samples_per_category)
        
        # Calculate failure rate
        total_tests = summary.total_tests
        failed_tests = summary.failed_tests
        failure_rate = (failed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Prepare response data
        response_data = {
            "message": "Stress tests completed successfully!",
            "summary": {
                "total_tests": total_tests,
                "successful_tests": summary.successful_tests,
                "failed_tests": failed_tests,
                "failure_rate": round(failure_rate, 2),
                "total_duration": round(summary.total_duration, 2),
                "average_response_time": round(summary.average_response_time, 3),
                "category_breakdown": summary.category_breakdown
            },
            "data_received": data
        }
        
        print(f"✅ Tests completed! Failure rate: {failure_rate:.2f}%")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Error running stress tests: {str(e)}")
        return jsonify({
            "error": f"Failed to run stress tests: {str(e)}",
            "data_received": data
        }), 500

if __name__ == '__main__':
    # Runs the Flask app on localhost, port 5001
    # The 'debug=True' part is very helpful for development.
    app.run(debug=True, port=5001)
