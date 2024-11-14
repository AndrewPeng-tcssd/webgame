from fastapi import FastAPI, WebSocket
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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        dt = await websocket.receive_text()
        data = json.loads(dt)
        await websocket.send_text(json.dumps(data))
    
#@app.get("/")
#async def get():
    #return {"message": "Hello World"}
        #
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)