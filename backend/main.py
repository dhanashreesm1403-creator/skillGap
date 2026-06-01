from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os
import json
import random
from dotenv import load_dotenv

load_dotenv()

# Load all 3 keys and filter out any empty ones
keys = [
    os.getenv("GEMINI_KEY_1"),
    os.getenv("GEMINI_KEY_2"),
    os.getenv("GEMINI_KEY_3"),
]
keys = [k for k in keys if k]

def get_client():
    # Randomly pick a key each time — spreads the load
    key = random.choice(keys)
    return genai.Client(api_key=key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    jobDescription: str
    currentSkills: str
    preparationDuration: str
    dailyHours: str

@app.get("/")
def root():
    return {"message": "SkillGap backend is running! 🚀"}

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    prompt = f"""
    You are an expert career coach and skill gap analyzer.
    
    A user wants to apply for the following job:
    {request.jobDescription}
    
    They currently have these skills:
    {request.currentSkills}
    
    They have {request.preparationDuration} to prepare.
    They can dedicate {request.dailyHours} hours per day.
    
    Analyze the skill gap and return a JSON response with this EXACT structure:
    {{
        "missingSkills": ["skill1", "skill2"],
        "existingSkills": ["skill1", "skill2"],
        "readinessScore": 40,
        "feasibilityScore": 85,
        "feasibilityLabel": "Highly Achievable",
        "feasibilityMessage": "Based on your timeline and daily hours, this is achievable!",
        "totalRequiredHours": 160,
        "totalAvailableHours": 90,
        "schedule": [
            {{
                "week": 1,
                "focus": "Skill Name",
                "days": "Day 1-7",
                "tasks": ["task1", "task2", "task3"],
                "estimatedHours": 20
            }}
        ],
        "resources": [
            {{
                "skill": "Skill Name",
                "platform": "Platform Name",
                "url": "https://actual-free-url.com",
                "type": "free"
            }}
        ],
        "projects": [
            {{
                "title": "Project Title",
                "description": "Brief description",
                "difficulty": "Beginner"
            }}
        ]
    }}
    
    Important rules:
    1. Only return valid JSON — no extra text, no markdown, no backticks
    2. readinessScore = percentage of required skills user already has (0-100)
    3. feasibilityScore = how achievable given their time (0-100)
    4. feasibilityLabel must be one of: "Highly Achievable", "Challenging but Possible", "Difficult", "Unrealistic"
    5. All resource URLs must be real, working, free websites
    6. Generate at least 3 industry-relevant projects
    7. Schedule should be week by week based on their duration
    """

    # Try each key — if one fails move to next
    random.shuffle(keys)
    for key in keys:
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            raw = response.text.strip()
            
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            
            result = json.loads(raw.strip())
            return result

        except Exception as e:
            # This key failed — try the next one
            continue

    # All keys failed
    return {"error": "All API keys exhausted. Please try again later."}