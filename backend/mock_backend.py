import http.server
import socketserver
import json
import time
import threading

PORT = 8000

class MockHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path.startswith('/review'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Simulate processing time
            time.sleep(2)
            
            response_data = {
                "language": "python",
                "score": 85,
                "grade": "B",
                "summary": "Good code overall, but has some security vulnerabilities and performance bottlenecks.",
                "total_issues": 3,
                "issue_counts": {"critical": 1, "high": 1, "medium": 0, "low": 1, "info": 0},
                "metrics": {"code_lines": 25, "total_lines": 30},
                "issues": [
                    {
                        "category": "security",
                        "severity": "critical",
                        "title": "SQL Injection Vulnerability",
                        "line": 10,
                        "description": "User input is directly interpolated into a SQL query. This allows an attacker to execute arbitrary SQL commands.",
                        "fix": "Use parameterized queries:\ncursor.execute('SELECT * FROM users WHERE username=?', (username,))"
                    },
                    {
                        "category": "performance",
                        "severity": "high",
                        "title": "Inefficient Database Loop",
                        "line": 18,
                        "description": "The code fetches all users and then filters them in Python. This is extremely inefficient for large datasets.",
                        "fix": "Filter directly in the SQL query:\ncursor.execute('SELECT * FROM users WHERE username=?', (username,))"
                    },
                    {
                        "category": "quality",
                        "severity": "low",
                        "title": "Missing Docstring",
                        "line": 5,
                        "description": "The function 'get_user' lacks a docstring explaining its purpose and parameters.",
                        "fix": "def get_user(username):\n    \"\"\"Fetches user details from the database.\"\"\""
                    }
                ]
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

with socketserver.TCPServer(("", PORT), MockHandler) as httpd:
    print(f"Mock Backend running at port {PORT}")
    httpd.serve_forever()
