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
def chat_with_inspector(code: str, language: str, history: list, message: str) -> str:
    if not client:
        return "[ERROR] NVIDIA_API_KEY not configured."
    
    system_prompt = f"""You are 'INSPECTOR', an advanced AI Code Reviewer.
    You are helping a developer with their {language} code.
    
    CURRENT CODE CONTEXT:
    ```{language}
    {code[:4000]}
    ```
    
    Be concise, professional, and slightly futuristic. Focus on providing deep technical insights."""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history (limit to last 10 messages for context)
    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Add new message
    messages.append({"role": "user", "content": message})

    try:
        completion = client.chat.completions.create(
            model="meta/llama-3.1-405b-instruct",
            messages=messages,
            temperature=0.5,
            max_tokens=1024,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"[ERROR] {str(e)}"
