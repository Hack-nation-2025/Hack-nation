# LLM Stress Test Runner

A comprehensive stress testing framework for Large Language Models (LLMs) that integrates with the existing test generators to provide robust performance and reliability testing.

## Features

- **Multiple Stress Test Types**: Basic, concurrent, rate-limited, burst, and endurance testing
- **Test Case Integration**: Automatically uses test cases from `test_generators.py`
- **Performance Monitoring**: Tracks response times, memory usage, and success rates
- **Comprehensive Reporting**: Detailed statistics and JSON result export
- **Configurable Concurrency**: Adjustable worker pools for different load scenarios
- **Memory Monitoring**: Real-time memory usage tracking during tests
- **Category-Specific Evaluation**: Intelligent success criteria for different test categories

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure you have access to your LLM client (from `conftest.py`)

## Quick Start

### Basic Usage

```python
from stress_test_runners import LLMStressTester
from conftest import your_llm_client  # Your actual LLM client

# Create a stress tester
tester = LLMStressTester(your_llm_client, max_workers=10)

# Run a basic stress test
categories = ["malformed_json", "contradictory_instructions"]
summary = tester.run_basic_stress_test(categories, samples_per_category=10)

# Print results
tester.print_summary(summary)

# Save results
tester.save_results()
```

### Run Complete Test Suite

```python
from stress_test_runners import run_stress_test_suite
from conftest import your_llm_client

# Run all stress test types
all_summaries = run_stress_test_suite(your_llm_client)
```

## Test Types

### 1. Basic Stress Test
Sequential execution of test cases to establish baseline performance.

```python
summary = tester.run_basic_stress_test(categories, samples_per_category=10)
```

### 2. Concurrent Stress Test
Tests LLM performance under concurrent load using multiple worker threads.

```python
summary = tester.run_concurrent_stress_test(categories, samples_per_category=10)
```

### 3. Rate-Limited Stress Test
Simulates real-world API rate limiting constraints.

```python
summary = tester.run_rate_limited_stress_test(
    categories, 
    requests_per_second=5, 
    samples_per_category=10
)
```

### 4. Burst Stress Test
Tests performance under sudden load spikes with configurable burst sizes.

```python
summary = tester.run_burst_stress_test(
    categories, 
    burst_size=20, 
    samples_per_category=10
)
```

### 5. Endurance Test
Long-running tests to evaluate performance over extended periods.

```python
summary = tester.run_endurance_test(
    categories, 
    duration_minutes=10, 
    requests_per_minute=60, 
    samples_per_category=10
)
```

## Configuration Options

### LLMStressTester Parameters

- `llm_client`: Your LLM client function (from `conftest.py`)
- `max_workers`: Maximum number of concurrent workers (default: 10)

### Test Parameters

- `categories`: List of test categories to run
- `samples_per_category`: Number of test cases per category
- `requests_per_second`: Rate limit for rate-limited tests
- `burst_size`: Number of concurrent requests in burst tests
- `duration_minutes`: Test duration for endurance tests
- `requests_per_minute`: Request rate for endurance tests

## Available Test Categories

The stress tester automatically integrates with these test categories from `test_generators.py`:

- `malformed_json`: Tests handling of invalid JSON inputs
- `contradictory_instructions`: Tests instruction following under contradictions
- `textual_adversarial`: Tests robustness against adversarial text
- `prompt_injection`: Tests security against prompt injection attempts
- `multilingual`: Tests performance with multiple languages

## Result Analysis

### StressTestSummary Fields

- `total_tests`: Total number of tests executed
- `successful_tests`: Number of successful tests
- `failed_tests`: Number of failed tests
- `total_duration`: Total test duration in seconds
- `average_response_time`: Average response time
- `min_response_time`: Minimum response time
- `max_response_time`: Maximum response time
- `response_time_percentiles`: 25th, 50th, 75th, 90th, 95th, 99th percentiles
- `memory_usage_stats`: Memory usage statistics
- `category_breakdown`: Success/failure breakdown by category
- `start_time`: Test start timestamp
- `end_time`: Test end timestamp

### Memory Monitoring

The framework automatically tracks:
- Current memory usage
- Peak memory usage during tests
- Memory usage per test case

## Output and Reporting

### Console Output
Detailed real-time progress and final summary with statistics.

### JSON Export
Comprehensive results saved to timestamped JSON files:
- Individual test results
- Performance metrics
- Memory usage data
- Test metadata

### Example Output
```
============================================================
STRESS TEST SUMMARY
============================================================
Test Duration: 45.23 seconds
Total Tests: 100
Successful: 87
Failed: 13
Success Rate: 87.0%

Response Time Statistics:
  Average: 0.452s
  Min: 0.123s
  Max: 2.341s
  Percentiles:
    25th: 0.234s
    50th: 0.412s
    75th: 0.623s
    90th: 0.891s
    95th: 1.234s
    99th: 2.123s

Memory Usage Statistics:
  Min: 45.23 MB
  Max: 67.89 MB
  Average: 52.45 MB
  Peak: 78.12 MB

Category Breakdown:
  malformed_json: 18/20 (90.0%)
  contradictory_instructions: 15/20 (75.0%)
  textual_adversarial: 20/20 (100.0%)
  prompt_injection: 17/20 (85.0%)
  multilingual: 17/20 (85.0%)
============================================================
```

## Integration with Existing Code

### Using with conftest.py
```python
# In your test or script
from conftest import llm_client  # Your configured LLM client
from stress_test_runners import LLMStressTester

tester = LLMStressTester(llm_client)
```

### Using with test_generators.py
The stress tester automatically uses the `get_test_cases()` function from your test generators, so no additional configuration is needed.

## Best Practices

### 1. Start Small
Begin with basic stress tests and small sample sizes to establish baselines.

### 2. Monitor Resources
Watch memory usage and system resources during concurrent tests.

### 3. Gradual Scaling
Increase concurrency and load gradually to identify breaking points.

### 4. Category Selection
Focus on specific categories relevant to your use case rather than running all at once.

### 5. Result Analysis
Use the detailed metrics to identify performance bottlenecks and failure patterns.

## Troubleshooting

### Common Issues

1. **Memory Issues**: Reduce `max_workers` or `samples_per_category`
2. **Rate Limiting**: Adjust `requests_per_second` based on your LLM provider's limits
3. **Test Failures**: Check LLM client configuration and network connectivity
4. **Import Errors**: Ensure all dependencies are installed and paths are correct

### Performance Tuning

- **Concurrency**: Start with 5-10 workers, increase based on system capabilities
- **Sample Size**: Begin with 5-10 samples per category
- **Test Duration**: Start with short tests (1-2 minutes) for endurance testing

## Example Scripts

See `example_stress_test.py` for comprehensive usage examples including:
- Individual test type demonstrations
- Custom test configurations
- Error handling
- Result analysis

## Contributing

To extend the stress testing framework:

1. Add new test types to the `LLMStressTester` class
2. Implement new evaluation criteria in `_evaluate_success()`
3. Add new metrics to `StressTestSummary`
4. Extend memory monitoring capabilities

## License

This stress testing framework is part of the Hack-nation project and follows the same licensing terms.
