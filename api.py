from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from gtts import gTTS
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

# --- Ensure audio directory exists ---
os.makedirs("audio", exist_ok=True)

# --- Request models ---
class StoryRequest(BaseModel):
    user_input: str
    child_age: str
    story_duration: str

class TTSRequest(BaseModel):
    story_text: str


# --- Generate Story ---
def generate_story(user_input: str, child_age: str, story_duration: str) -> str:
    prompt = f"""
    You are a warm and creative storyteller who writes bedtime stories for children aged {child_age}.
    
    The user described what they want in a story as follows:
    "{user_input}"

    Please write a complete bedtime story that:
    - Reflects the user's request.
    - Is suitable for a child aged {child_age}.
    - Takes about {story_duration} to read aloud.
    - Has a clear beginning, middle, and comforting happy ending.
    - Is imaginative, gentle, emotional, and expressive.
    - Includes a soft moral.
    - Do NOT use asterisks.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        raise HTTPException(500, f"Story generation failed: {str(e)}")


# --- Text-to-Speech ---
def text_to_speech(story_text: str) -> str:
    try:
        filename = f"story_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join("audio", filename)

        tts = gTTS(text=story_text, lang="en")
        tts.save(filepath)

        return filename

    except Exception as e:
        raise HTTPException(500, f"TTS generation failed: {str(e)}")


# --- API Endpoints ---
@app.post("/generate_story")
async def create_story(request: StoryRequest):
    story = generate_story(request.user_input, request.child_age, request.story_duration)
    return {"story": story}


@app.post("/tts")
async def create_tts(request: TTSRequest):
    filename = text_to_speech(request.story_text)
    return {"filename": filename}


@app.get("/audio/{filename}")
async def serve_audio(filename: str):
    filepath = os.path.join("audio", filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "Audio file not found")
    return FileResponse(filepath, media_type="audio/mpeg")


@app.get("/")
async def root():
    return {"message": "🌙 Bedtime Story API is running!"}