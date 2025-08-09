# FailProof LLM – Stress-test AI with edge cases & malformed inputs

A stress-testing framework that bombards LLMs and AI agents with edge cases, malformed inputs, and adversarial prompts to identify vulnerabilities before production.

## Purpose

This framework helps enterprises test AI systems against real-world failure scenarios including:
- Malformed JSON, mixed languages, and special characters
- Prompt injections and contradictory instructions
- Very long inputs and Unicode edge cases
- Domain-specific adversarial inputs

## Features

- **Test Case Generator** – Creates diverse adversarial inputs and edge cases
- **Automated Stress Runner** – Feeds test cases to any LLM via API and records failures
- **Failure Analysis Dashboard** – Classifies and visualizes failure modes with actionable reports

## Technology

Built using Python with support for OpenAI, Anthropic, Hugging Face, and other LLM APIs.

## Quick Start
### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Setup Instructions
1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your environment variables:**
   ```bash
   # Create a .env file with your API keys
   echo "OPENAI_API_KEY=your_openai_key_here" > .env
   echo "ANTHROPIC_API_KEY=your_anthropic_key_here" >> .env
   ```

4. **Run the stress test:**
   ```bash
   python example.py
   ```