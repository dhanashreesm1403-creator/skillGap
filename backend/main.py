from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from supabase import create_client
import os
import json
import random
from dotenv import load_dotenv

load_dotenv()

keys = [
    os.getenv("GEMINI_KEY_1"),
    os.getenv("GEMINI_KEY_2"),
    os.getenv("GEMINI_KEY_3"),
]
keys = [k for k in keys if k]

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

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
    prompt = (
        "You are an expert career coach and skill gap analyzer.\n\n"
        f"Job Description: {request.jobDescription}\n\n"
        f"User's Current Skills: {request.currentSkills}\n\n"
        f"Preparation Duration: {request.preparationDuration}\n"
        f"Daily Learning Hours: {request.dailyHours} hours per day\n\n"
        "Return ONLY a valid JSON object with this exact structure, no extra text:\n"
        "{\n"
        '  "missingSkills": ["skill1", "skill2"],\n'
        '  "existingSkills": ["skill1", "skill2"],\n'
        '  "readinessScore": 40,\n'
        '  "feasibilityScore": 85,\n'
        '  "feasibilityLabel": "Highly Achievable",\n'
        '  "feasibilityMessage": "Your timeline is achievable!",\n'
        '  "totalRequiredHours": 160,\n'
        '  "totalAvailableHours": 90,\n'
        '  "schedule": [{"week": 1, "focus": "Skill", "days": "Day 1-7", "tasks": ["task1"], "estimatedHours": 20}],\n'
        '  "resources": [{"skill": "Skill", "platform": "Platform", "url": "https://example.com", "type": "free"}],\n'
        '  "projects": [{"title": "Project", "description": "Description", "difficulty": "Beginner"}],\n'
        '  "skillsWithHours": [{"name": "Skill", "estimatedHours": 20}]\n'
        "}"
    )

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

            try:
                session = supabase.table("sessions").insert({
                    "job_description": request.jobDescription,
                    "current_skills": request.currentSkills,
                    "preparation_duration": request.preparationDuration,
                    "daily_hours": request.dailyHours,
                    "readiness_score": result.get("readinessScore", 0),
                    "feasibility_score": result.get("feasibilityScore", 0)
                }).execute()

                session_id = session.data[0]["id"]

                for skill in result.get("missingSkills", []):
                    supabase.table("skill_progress").insert({
                        "session_id": session_id,
                        "skill_name": skill,
                        "status": "locked"
                    }).execute()

                result["sessionId"] = session_id

            except Exception as db_error:
                print(f"DB Error: {db_error}")

            return result

        except Exception as e:
            print(f"Key failed: {e}")
            continue

# Model for saving test results
class TestResult(BaseModel):
    sessionId: str
    skillName: str
    score: int
    passed: bool

@app.post("/save-test")
async def save_test(result: TestResult):
    # Why: saves every test attempt to database permanently
    try:
        # Save test attempt
        supabase.table("test_attempts").insert({
            "session_id": result.sessionId,
            "skill_name": result.skillName,
            "score": result.score,
            "passed": result.passed
        }).execute()

        # If passed, update skill status to completed
        if result.passed:
            supabase.table("skill_progress").update({
                "status": "completed"
            }).eq("session_id", result.sessionId).eq("skill_name", result.skillName).execute()

        return {"message": "Test result saved!", "passed": result.passed}

    except Exception as e:
        return {"error": str(e)}

@app.get("/session/{session_id}")
async def get_session(session_id: str):
    # Why: lets frontend load saved progress when user returns
    try:
        progress = supabase.table("skill_progress").select("*").eq("session_id", session_id).execute()
        return {"skills": progress.data}
    except Exception as e:
        return {"error": str(e)}
    
    return {"error": "All API keys exhausted. Please try again later."}