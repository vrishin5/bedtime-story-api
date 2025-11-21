from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import uuid

# --- Load environment variables ---
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Initialize FastAPI app ---
app = FastAPI(
    title="Bedtime Story Generator API",
    description="Backend API for the Bedtime Story App",
    version="1.0.0"
)


# --- Pydantic request models ---
class StoryRequest(BaseModel):
    user_input: str
    child_age: str
    story_duration: str


class TTSRequest(BaseModel):
    story_text: str
    voice: str | None = "sage"   # default to sage if not provided


# --- Helper function: generate story ---
def generate_story(user_input: str, child_age: str, story_duration: str) -> str:
    """Generate a bedtime story directly from user input."""
    prompt = f"""
    You are a warm and creative storyteller who writes bedtime stories for children aged {child_age}.
    
    The user described what they want in a story as follows:
    "{user_input}"

    Please write a complete bedtime story that:
    - Reflects the user's idea or request.
    - Is suitable for a child aged {child_age}.
    - Takes about {story_duration} to read aloud.
    - Has a clear beginning, middle, and comforting happy ending.
    - Is imaginative, gentle, and emotionally expressive.
    - Includes a soft moral or life lesson.
    - Do not use any asterisks.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
        )
        story = response.choices[0].message.content.strip()
        return story
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")


# --- Helper function: text-to-speech with OpenAI ---
def text_to_speech(story_text: str, voice: str = "sage") -> str:
    """
    Convert story text to speech (MP3) using OpenAI TTS.
    Voice should be one of: alloy, ash, ballad, coral, echo, fable, onyx,
    nova, sage, shimmer, verse.
    """
    filename = f"story_{uuid.uuid4().hex}.mp3"
    try:
        audio_bytes = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            format="mp3",
            input=story_text,
        )
        with open(filename, "wb") as f:
            f.write(audio_bytes)
        return filename
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


# --- Endpoint: Generate Story ---
@app.post("/generate_story")
async def create_story(request: StoryRequest):
    """Create a bedtime story from user input."""
    story = generate_story(request.user_input, request.child_age, request.story_duration)
    return {"story": story}


# --- Endpoint: Text to Speech (returns filename as JSON) ---
@app.post("/tts")
async def create_tts(request: TTSRequest):
    """
    Convert story text to speech, save an MP3, and return the filename.
    Frontend will then GET /audio/{filename} to stream it.
    """
    voice = request.voice or "sage"
    filename = text_to_speech(request.story_text, voice)
    return {"filename": filename}


# --- Endpoint: Serve audio file by filename ---
@app.get("/audio/{filename}")
async def get_audio(filename: str):
    filepath = os.path.join(os.getcwd(), filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(
        path=filepath,
        media_type="audio/mpeg",
        filename=filename,
    )


# --- Root Endpoint ---
@app.get("/")
async def root():
    return {"message": "🌙 Bedtime Story API is running!"}