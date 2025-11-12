import os
from openai import OpenAI
from dotenv import load_dotenv

"""
Before submitting the assignment, describe here in a few sentences what you would have built next if you spent 2 more hours on this project:

"""

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_request(prompt: str) -> str:
    system_prompt = """
    You are a helpful assistant that analyzes children's story requests.
    For the given user request, extract:
    - a one-word category (e.g., friendship, courage, fantasy, mystery, love)
    - the main character's name (if given)
    - the setting or place (if given)
    Respond in JSON format like this:
    {"category": "fantasy", "character": "Finn", "setting": "snowy mountains"}
    """
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [
            {"role" : "system", "content": system_prompt},
            {"role" : "user", "content" : prompt}
            ],
            temperature = 0.2
    )
    import json
    try:
        result = json.loads(response.choices[0].message.content)
    except:
        result = {"category" : "general", "character" : " ", "setting" : " "}
    return result

def generate_story(user_prompt: str, category: str, character: str = "", setting: str = "") -> str:
    details = ""
    if character:
        details += f"The main character is {character}. "
    if setting:
        details += f"The story takes place in {setting}. "
    prompt = f"""
    You are a warm and creative storyteller who writes bedtime stories for children aged 5-10.
    Your story should reflect the category: {category}
    {details}

    The user requested: "{user_prompt}"

    Write a story in 5 short paragraphs with a clear beginning, middle, and end.
    Include gentle lessons and imaginative elements appropriate for young readers.
    """
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role" : "user", "content" : prompt}],
        temperature = 0.9
    )
    return response.choices[0].message.content.strip()

def judge_story(story:str) -> str:
    judge_prompt = f"""
    You are an expert children's literature critic.
    Evaluate the following story for:
    - Age-appropriateness (5-10)
    - Story arc quality
    - Clarity of moral
    - Creativity
    - Emotional tone

    Then give constructive feedback and suggest one or two improvements.

    STORY:
    {story}
    """
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role": "user", "content" : judge_prompt}],
        temperature = 0.7
    )
    return response.choices[0].message.content.strip()

def refine_story(story: str, feedback: str) -> str:
    refine_prompt = f"""
    You are a children's storyteller revising your work.

    Original story:
    {story}

    Feedback:
    {feedback}

    Improve the story while keeping it warm, age-appropriate, and imaginative.
    """
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role": "user", "content" : refine_prompt}],
        temperature = 0.9
    )
    return response.choices[0].message.content.strip()

def main():
    print("Welcome! I am a bedtime story generator")
    user_prompt = input("What kind of story would you like tonight? The popular categories are: fantasy, adventure, animal, and friendship. Give me something from here or what you want your story to be about. ")
    analysis = analyze_request(user_prompt)
    category = analysis.get("category", "general")
    character = analysis.get("character", "")
    setting = analysis.get("setting", "")
    print(f"Category identified: {category} story")
    if character.strip():
        print(f"Main character: {character}")
    if setting.strip():
        print(f"Set in: {setting}")
    story = generate_story(user_prompt, category, character, setting)
    print("first draft") #delete
    print(story) #delete
    feedback = judge_story(story)
    print("feedback") #delete
    print(feedback) #delete
    refined_story = refine_story(story, feedback)
    print("final") #delete
    print(refined_story)
    while True:
        choice = input("Would you like any changes? (yes/no): ").strip().lower()
        if choice == "no" or choice == "n":
            print("Goodnight")
            break
        else:
            user_feedback = input("Please describe what changes you would like to see: ")
            refined_story = refine_story(refined_story, user_feedback)
            print("Updated story")
            print(refined_story)

if __name__ == "__main__":
    main()