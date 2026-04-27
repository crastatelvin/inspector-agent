# ============================================
# Project: INSPECTOR — AI Code Review Agent
# Author: Telvin Crasta
# License: MIT
# ============================================

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize NVIDIA NIM Client (OpenAI Compatible)
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
client = None

if NVIDIA_API_KEY:
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NVIDIA_API_KEY
    )

def call_nvidia(prompt: str) -> str:
    if not client:
        return "[ERROR] NVIDIA_API_KEY not configured."
    
    try:
        completion = client.chat.completions.create(
            model="meta/llama-3.1-405b-instruct", # Using 405B for Senior Engineer level reviews
            messages=[
                {"role": "system", "content": "You are a Senior Software Engineer and Security Researcher performing a code review."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            top_p=0.7,
            max_tokens=2048,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"[ERROR] {str(e)}"
