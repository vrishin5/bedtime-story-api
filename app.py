import os
import base64
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
from gtts import gTTS

# --- Load environment variables ---
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Story Generator ---
def generate_story(user_input: str, child_age: str, story_duration: str) -> str:
    """Generate a bedtime story directly from user input."""
    prompt = f"""
    You are a warm, creative storyteller who writes bedtime stories for children aged {child_age}.
    
    The user described what they want in a story as follows:
    "{user_input}"

    Please write a complete bedtime story that:
    - Reflects the user's idea or request.
    - Is suitable for a child aged {child_age}.
    - Takes about {story_duration} to read aloud.
    - Has a clear beginning, middle, and comforting happy ending.
    - Is imaginative, gentle, and emotionally expressive.
    - Includes a soft moral or life lesson.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.9
    )

    return response.choices[0].message.content.strip()


# --- Convert story to speech ---
def text_to_speech(story_text: str):
    """Convert story text into an audio file using gTTS."""
    tts = gTTS(story_text, lang="en", slow=False)
    output_file = "story_audio.mp3"
    tts.save(output_file)
    return output_file


# --- Streamlit UI ---
st.set_page_config(page_title="Bedtime Story Generator", page_icon="🌙", layout="centered")

st.title("🌙 AI Bedtime Story Generator")
st.write("Create personalized bedtime stories for your child — comforting, imaginative, and full of wonder!")

st.markdown("""
🪄 **How it works:**
- You can type a **category** (fantasy, adventure, friendship, animals, courage, comedy),
- Or describe what the story should be about in your own words,
- Or even mention a **character from a movie or show** — the story will adapt naturally!
""")

# --- User inputs ---
child_age = st.selectbox("👶 Child's Age Range", ["3–5", "5–8", "8–10"])
story_duration = st.selectbox("⏳ Story Length", ["5–10 minutes", "15–30 minutes", "30–60 minutes"])
user_input = st.text_area("✨ What kind of story would you like tonight?", placeholder="e.g. A brave rabbit who learns to fly, or Spider-Man in a cozy bedtime story.")

output_choice = st.radio("📖 Output Type", ["Text Only", "Text + Audio"])

# --- Generate story ---
if st.button("🪄 Generate Story"):
    if not user_input.strip():
        st.warning("Please describe the kind of story you'd like.")
    else:
        with st.spinner("✨ Crafting your bedtime story..."):
            story = generate_story(user_input, child_age, story_duration)

        st.subheader("📖 Your Bedtime Story")
        st.write(story)

        # --- Optional audio ---
        if output_choice == "Text + Audio":
            with st.spinner("🎧 Generating soothing narration..."):
                audio_file = text_to_speech(story)

            try:
                with open(audio_file, "rb") as audio:
                    audio_bytes = audio.read()
                    b64 = base64.b64encode(audio_bytes).decode()
                    audio_html = f"""
                        <audio controls autoplay>
                            <source src="data:audio/mp3;base64,{b64}" type="audio/mp3">
                            Your browser does not support the audio element.
                        </audio>
                    """
                    st.markdown(audio_html, unsafe_allow_html=True)
                    st.success("✅ Audio ready! Enjoy your bedtime story.")
            except Exception as e:
                st.error(f"⚠️ Could not play the audio: {e}")

st.markdown("---")
st.caption("Made with ❤️ for dreamers of all ages. 🌙")