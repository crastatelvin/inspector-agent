# ============================================
# Project: INSPECTOR — AI Code Review Agent
# Author: Telvin Crasta
# License: CC BY-NC 4.0
# ============================================

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import uuid

from code_analyzer import detect_language, get_code_metrics
from review_agent import review_code

app = FastAPI(title="INSPECTOR — AI Code Review Agent")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Map to store active websocket connections by client_id
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_personal_message(self, message: dict, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(json.dumps(message))

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@app.get("/")
def root():
    return {
        "status": "INSPECTOR ONLINE",
        "author": "Telvin Crasta",
        "version": "1.0",
        "supported_languages": list(LANGUAGE_PATTERNS.keys())
    }

@app.post("/review/{client_id}")
async def review(client_id: str, body: dict):
    code = body.get("code", "").strip()
    language = body.get("language", "")

    if not code:
        return JSONResponse(status_code=400, content={"error": "Code required"})

    if not language:
        language = detect_language(code)

    metrics = get_code_metrics(code)
    
    # Broadcast function scoped to this client_id
    async def broadcast_fn(data: dict):
        await manager.send_personal_message(data, client_id)

    await broadcast_fn({"event": "start", "language": language,
                      "message": f"Initializing {language} scan..."})

    try:
        result = await review_code(code, language, broadcast_fn)
        result["language"] = language
        result["metrics"] = metrics

        await broadcast_fn({
            "event": "complete",
            "message": f"Review complete — Score: {result['score']}/100",
            "score": result["score"],
            "total_issues": result["total_issues"]
        })

        return JSONResponse(result)
    except Exception as e:
        await broadcast_fn({"event": "error", "message": str(e)})
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
