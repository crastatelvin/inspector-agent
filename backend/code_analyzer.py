# ============================================
# Project: INSPECTOR — AI Code Review Agent
# Author: Telvin Crasta
# License: MIT
# ============================================

import re

LANGUAGE_PATTERNS = {
    "python": [r"def\s+\w+\(", r"import\s+\w+", r"class\s+\w+:", r"print\(", r"if\s+__name__"],
    "javascript": [r"function\s+\w+\(", r"const\s+\w+\s*=", r"let\s+\w+\s*=", r"=>\s*{", r"console\.log"],
    "typescript": [r"interface\s+\w+", r":\s*string\b", r":\s*number\b", r"<\w+>", r"async\s+function"],
    "java": [r"public\s+class", r"public\s+static", r"System\.out\.print", r"import\s+java\."],
    "cpp": [r"#include\s*<", r"std::", r"int\s+main\(", r"cout\s*<<"],
    "go": [r"func\s+\w+\(", r"package\s+main", r"import\s+\"", r":=\s*"],
    "rust": [r"fn\s+\w+\(", r"let\s+mut\s+", r"impl\s+\w+", r"use\s+std::"],
    "sql": [r"SELECT\s+", r"INSERT\s+INTO", r"UPDATE\s+\w+\s+SET", r"CREATE\s+TABLE"],
    "html": [r"<html", r"<div", r"<body", r"<!DOCTYPE"],
    "css": [r"{\s*\w+:", r"@media", r"\.[\w-]+\s*{"],
}

def detect_language(code: str) -> str:
    scores = {}
    for lang, patterns in LANGUAGE_PATTERNS.items():
        score = sum(1 for p in patterns if re.search(p, code, re.IGNORECASE))
        if score > 0:
            scores[lang] = score
    return max(scores, key=scores.get) if scores else "unknown"

def get_code_metrics(code: str) -> dict:
    lines = code.split('\n')
    non_empty = [l for l in lines if l.strip()]
    comment_lines = [l for l in lines if l.strip().startswith(('#', '//', '/*', '*', '<!--'))]

    return {
        "total_lines": len(lines),
        "code_lines": len(non_empty),
        "comment_lines": len(comment_lines),
        "avg_line_length": round(sum(len(l) for l in non_empty) / max(len(non_empty), 1)) if non_empty else 0,
        "max_line_length": max((len(l) for l in lines), default=0),
        "char_count": len(code),
        "estimated_tokens": round(len(code) / 4),
        "has_comments": len(comment_lines) > 0
    }
