from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import uuid

# Load env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="Bedtime Story API")

class StoryRequest(BaseModel):
    user_input: str
    child_age: str
    story_duration: str

class TTSRequest(BaseModel):
    story_text: str
    voice: str   # NEW: user can choose voice


def generate_story(user_input: str, child_age: str, story_duration: str) -> str:
    prompt = f"""
    You are a warm, gentle storyteller for children aged {child_age}.
    The user described this idea: "{user_input}"

    Write a cozy bedtime story that lasts about {story_duration}
    and has a comforting arc, emotional depth, and a soft moral.
    Avoid asterisks and formatting symbols.
    """

    try:
        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9
        )
        return res.choices[0].message.content.strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")


@app.post("/generate_story")
async def create_story(request: StoryRequest):
    story = generate_story(request.user_input, request.child_age, request.story_duration)
    return {"story": story}


# -------------- OPENAI TTS ENDPOINT (FIXED) ------------------

@app.post("/tts")
async def tts(request: TTSRequest):
    """Generate TTS using OpenAI's new Audio API."""
    try:
        filename = f"story_{uuid.uuid4().hex}.mp3"

        # CORRECT 2025 OPENAI SYNTAX
        speech = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=request.voice,
            input=request.story_text
        )

        # Write audio file
        with open(filename, "wb") as f:
            f.write(speech.read())

        return {"filename": filename}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve stored MP3 files."""
    filepath = f"./{filename}"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, media_type="audio/mpeg")


@app.get("/")
async def root():
    return {"message": "🌙 Bedtime Story API is running!"}