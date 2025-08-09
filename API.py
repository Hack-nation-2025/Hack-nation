from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from dotenv import load_dotenv

from elevenlabs.client import ElevenLabs
from openai import OpenAI

from io import BytesIO
import os

from typing import Iterator, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize clients
elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

gpt = OpenAI(
    api_key=os.getenv('GPT_API_KEY'),
)

# Initialize FastAPI app
app = FastAPI(
    title="Audio Processing API",
    description="API for processing audio files: speech-to-text and content analysis",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class TranscriptionResponse(BaseModel):
    success: bool
    transcription: Optional[str] = None
    analysis: Optional[str] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    message: str

def process_audio_iterator(audio_iterator: Iterator) -> bytes:
    """Convert audio iterator to bytes"""
    if isinstance(audio_iterator, Iterator):
        return b"".join(audio_iterator)
    return audio_iterator

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", message="API is running")

@app.post("/process-audio", response_model=TranscriptionResponse)
async def process_audio(file: UploadFile = File(...)):
    """
    Process an audio file: remove noise, transcribe, and analyze content
    """
    try:
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type: {file.content_type}. Please upload an audio file."
            )
        
        logger.info(f"Processing audio file: {file.filename}")
        
        # Read uploaded file
        audio_data = await file.read()
        audio_buffer = BytesIO(audio_data)
        
        # Step 1: Remove background noise and isolate voice
        logger.info("Removing background noise...")
        noiseless_audio = elevenlabs.audio_isolation.convert(
            audio=audio_buffer,
        )
        
        # Convert iterator to bytes if necessary
        noiseless_audio = process_audio_iterator(noiseless_audio)
        noiseless_audio_buffer = BytesIO(noiseless_audio)
        
        # Step 2: Speech to text conversion
        logger.info("Converting speech to text...")
        transcription = elevenlabs.speech_to_text.convert(
            file=noiseless_audio_buffer,
            model_id="scribe_v1",
            tag_audio_events=True,
            language_code="eng",
            diarize=True,
        )
        
        if not transcription.text.strip():
            return TranscriptionResponse(
                success=False,
                error="No speech detected in the audio file"
            )
        
        logger.info(f"Transcription completed: {transcription.text[:100]}...")
        
        # Step 3: Analyze with GPT
        logger.info("Analyzing content with GPT...")
        gpt_response = gpt.completions.create(
            model='gpt-5-nano',  # Updated to a valid model
            prompt="Yes or no answer, does the following sentence contain information someone using transportation services like trains, plane, subway, ... should need to hear. If yes, output the important part(s) of the sentence on a separate line.\n" + transcription.text,
            max_tokens=500,
            temperature=0.3
        )
        
        analysis = gpt_response.choices[0].text.strip() if gpt_response.choices else "No analysis available"
        
        logger.info("Processing completed successfully")
        
        return TranscriptionResponse(
            success=True,
            transcription=transcription.text,
            analysis=analysis
        )
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return TranscriptionResponse(
            success=False,
            error=f"Error processing audio: {str(e)}"
        )

@app.post("/generate-and-process", response_model=TranscriptionResponse)
async def generate_and_process_audio(text: str = "The first move is what sets everything in motion. Or at least that's what my grand ol' gram gram used to say!"):
    """
    Generate audio from text and then process it (for testing purposes)
    """
    try:
        logger.info(f"Generating audio from text: {text[:50]}...")
        
        # Generate audio using ElevenLabs
        audio = elevenlabs.text_to_speech.convert(
            text=text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        
        # Convert iterator to bytes if necessary
        audio = process_audio_iterator(audio)
        audio_buffer = BytesIO(audio)
        
        # Remove background noise
        logger.info("Removing background noise...")
        noiseless_audio = elevenlabs.audio_isolation.convert(
            audio=audio_buffer,
        )
        
        noiseless_audio = process_audio_iterator(noiseless_audio)
        noiseless_audio_buffer = BytesIO(noiseless_audio)
        
        # Speech to text
        logger.info("Converting speech to text...")
        transcription = elevenlabs.speech_to_text.convert(
            file=noiseless_audio_buffer,
            model_id="scribe_v1",
            tag_audio_events=True,
            language_code="eng",
            diarize=True,
        )
        
        # Analyze with GPT
        logger.info("Analyzing content...")
        gpt_response = gpt.completions.create(
            model='gpt-5-nano',
            prompt="Yes or no answer, does the following sentence contain information someone using transportation services like trains, plane, subway, ... should need to hear. If yes, output the important part(s) of the sentence on a separate line.\n" + transcription.text,
            max_tokens=500,
            temperature=0.3
        )
        
        analysis = gpt_response.choices[0].text.strip() if gpt_response.choices else "No analysis available"
        
        return TranscriptionResponse(
            success=True,
            transcription=transcription.text,
            analysis=analysis
        )
        
    except Exception as e:
        logger.error(f"Error in generate_and_process_audio: {str(e)}")
        return TranscriptionResponse(
            success=False,
            error=f"Error processing audio: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)