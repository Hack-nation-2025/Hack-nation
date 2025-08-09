# Real-Time Transport Accessibility App

A real-time transport notification app designed to ensure users are informed about important travel updates.

## Purpose

This app provides critical transport notifications for people who miss announcements due to:
- Wearing noise-cancelling headphones/AirPods
- Being deaf or hard of hearing
- Distractions

## Features

- **Real-time notifications** for transport updates including:
  - Gate changes at airports
  - Bus route or final destination changes
  - Train delays and platform changes
  - Service disruptions

- **Accessible alerts** delivered through:
  - Visual notifications
  - Text-based updates
  - Voice synthesis using ElevenLabs APIs

## Technology

Built using ElevenLabs APIs to provide high-quality text-to-speech capabilities.

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
   # Create a .env file with your ElevenLabs API key
   echo "ELEVENLABS_API_KEY=your_api_key_here" > .env
   ```

4. **Run the example:**
   ```bash
   python example.py
   ```