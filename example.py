from dotenv import load_dotenv

from elevenlabs.client import ElevenLabs
# from elevenlabs import play

from openai import OpenAI

from io import BytesIO
import requests

from typing import Iterator

import os


load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)
gpt = OpenAI(
    api_key=os.getenv('GPT_API_KEY'),
)



### * GET AUDIO FROM THE MICROPHONE
audio = elevenlabs.text_to_speech.convert(
    text="The first move is what sets everything in motion. Or at least that's what my grand ol' gram gram used to say!",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)
# play(audio)


### * PUT DATA INTO A FORM THAT CAN BE "READ" BY API  
if isinstance(audio, Iterator):
    audio = b"".join(audio)
audio = BytesIO( audio )



### * REMOVE BACKGROUND NOISE AND ISOLATE VOICE
noiseless_audio = elevenlabs.audio_isolation.convert(
    audio=audio,
)



### * PUT DATA INTO A FORM THAT CAN BE "READ" BY API  
if isinstance(noiseless_audio, Iterator):
    noiseless_audio = b"".join(noiseless_audio)
noiseless_audio = BytesIO( noiseless_audio )



### * AUDIO -> TEXT
transcription = elevenlabs.speech_to_text.convert(
    file=noiseless_audio,
    model_id="scribe_v1", # Model to use, for now only "scribe_v1" is supported
    tag_audio_events=True, # Tag audio events like laughter, applause, etc.
    language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
    diarize=True, # Whether to annotate who is speaking
)

print(transcription.text)


### * SEND TO CHAT GPT FOR ANALYSIS
gpt_response = gpt.responses.create(
    model='gpt-5-nano',
    input="Yes or no answer, does the following sentence contain information someone using transportation services like trains, plane, subway, ... should need to hear. If yes, output the important part(s) of the sentence on a separate line.\n" + transcription.text
)

if gpt_response.error is not None:
    print(gpt_response.output_text)


