# ============================================
# Project: INSPECTOR — AI Code Review Agent
# Author: Telvin Crasta
# License: CC BY-NC 4.0
# ============================================

import re
import asyncio
from nvidia_service import call_nvidia

SEVERITY_WEIGHTS = {
    "critical": 25,
    "high": 15,
    "medium": 8,
    "low": 3,
    "info": 1
}

async def review_code(code: str, language: str, broadcast_fn) -> dict:
    # We define independent tasks for each review dimension
    tasks = [
        _scan_dimension("security", code, language, "security expert", 
                        "Focus on: SQL injection, XSS, hardcoded credentials, insecure random, path traversal, command injection.", broadcast_fn),
        _scan_dimension("performance", code, language, "performance engineer", 
                        "Focus on: N+1 queries, unnecessary loops, memory leaks, blocking I/O, inefficient algorithms.", broadcast_fn),
        _scan_dimension("quality", code, language, "senior engineer", 
                        "Focus on: long functions, poor naming, magic numbers, code duplication, excessive complexity.", broadcast_fn),
        _scan_dimension("best_practice", code, language, "architect", 
                        "Focus on: SOLID principles, design patterns, language idioms, documentation.", broadcast_fn),
        _scan_dimension("suggestion", code, language, "senior developer", 
                        "Focus on: modernization, readability, maintainability, better patterns.", broadcast_fn)
    ]
    
    # Run all tasks in parallel
    results = await asyncio.gather(*tasks)
    
    # Flatten all issues
    all_issues = []
    for issue_list in results:
        all_issues.extend(issue_list)

    # Calculate score
    penalty = sum(SEVERITY_WEIGHTS.get(i.get("severity", "info"), 1) for i in all_issues)
    score = max(0, min(100, 100 - penalty))

    # Grade
    grade = "A" if score >= 90 else "B" if score >= 75 else "C" if score >= 60 else "D" if score >= 40 else "F"

    # Summary
    await broadcast_fn({"step": "summary", "message": "Generating final report..."})
    summary = _generate_summary(code, language, all_issues, score)

    return {
        "issues": all_issues,
        "score": score,
        "grade": grade,
        "summary": summary,
        "issue_counts": {
            "critical": sum(1 for i in all_issues if i.get("severity") == "critical"),
            "high": sum(1 for i in all_issues if i.get("severity") == "high"),
            "medium": sum(1 for i in all_issues if i.get("severity") == "medium"),
            "low": sum(1 for i in all_issues if i.get("severity") == "low"),
            "info": sum(1 for i in all_issues if i.get("severity") == "info"),
        },
        "total_issues": len(all_issues)
    }

async def _scan_dimension(category: str, code: str, language: str, persona: str, focus: str, broadcast_fn) -> list:
    await broadcast_fn({"step": category, "message": f"Analyzing {category}..."})
    
    prompt = f"""You are a {persona} reviewing {language} code.
    
CODE:
{code[:4000]}

Find {category} issues. For each issue found, return in this EXACT format:
ISSUE_START
SEVERITY: critical|high|medium|low|info
TITLE: [short title]
LINE: [line number or 0]
DESCRIPTION: [brief explanation]
FIX: [exact fixed code snippet]
ISSUE_END

{focus}
If no issues found, return NONE."""

    # Offload blocking AI call to thread
    response = await asyncio.to_thread(call_nvidia, prompt)
    return _parse_issues(response, category)

def _parse_issues(response: str, category: str) -> list:
    if not response or "NONE" in response.upper()[:20]:
        return []

    issues = []
    blocks = re.split(r'ISSUE_START', response)

    for block in blocks[1:]:
        end_idx = block.find('ISSUE_END')
        if end_idx != -1:
            block = block[:end_idx]

        issue = {"category": category, "severity": "info",
                 "title": "", "line": 0, "description": "", "fix": ""}

        lines = block.strip().split('\n')
        current_field = None
        
        for line in lines:
            line_str = line.strip()
            if line_str.startswith("SEVERITY:"):
                sev = line_str.replace("SEVERITY:", "").strip().lower()
                issue["severity"] = sev if sev in ["critical","high","medium","low","info"] else "info"
            elif line_str.startswith("TITLE:"):
                issue["title"] = line_str.replace("TITLE:", "").strip()
            elif line_str.startswith("LINE:"):
                try:
                    # Handle ranges like 5-10
                    line_val = line_str.replace("LINE:", "").strip().split('-')[0]
                    issue["line"] = int(line_val) if line_val.isdigit() else 0
                except:
                    issue["line"] = 0
            elif line_str.startswith("DESCRIPTION:"):
                issue["description"] = line_str.replace("DESCRIPTION:", "").strip()
            elif line_str.startswith("FIX:"):
                issue["fix"] = line_str.replace("FIX:", "").strip()
            elif issue["fix"] and not line_str.startswith(("SEVERITY:", "TITLE:", "LINE:", "DESCRIPTION:")):
                # Append to fix if it's multi-line
                issue["fix"] += "\n" + line

        if issue["title"] and issue["description"]:
            issues.append(issue)

    return issues[:5]

def _generate_summary(code: str, language: str, issues: list, score: int) -> str:
    critical = sum(1 for i in issues if i.get("severity") == "critical")
    high = sum(1 for i in issues if i.get("severity") == "high")

    if score >= 90:
        return f"Excellent {language} code. Clean and secure."
    elif score >= 75:
        return f"Good {language} code. {high} items need attention."
    elif score >= 60:
        return f"Acceptable code but has {high} high-severity findings."
    elif critical > 0:
        return f"CRITICAL: {critical} critical issues detected. Fix immediately."
    else:
        return f"Significant quality issues. Refactoring recommended."
