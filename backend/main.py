from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

players = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    player_id = id(websocket)
    players.append({"id": player_id, "x": 0, "y": 0, "name": "name"})
    try:
        while True:
            dt = await websocket.receive_text()
            data = json.loads(dt)
            await websocket.send_text(json.dumps(players))
    except WebSocketDisconnect:
        await player_disconnect(player_id, websocket)
    
async def player_disconnect(player_id, websocket):
    for i in range(len(players)):
        if players[i]["id"] == player_id:
            del players[i]
            await websocket.close()
        
#@app.get("/")
#async def get():
    #return {"message": "Hello World"}
        #
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)