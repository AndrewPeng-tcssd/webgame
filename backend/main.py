from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

players = []
map_width = 1
map_height = 1

def random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    player_id = id(websocket)
    id_sent = False
    players.append({"id": player_id, "x": 650, "y": 400, "name": "name", "color": random_color()})
    try:
        while True:
            if id_sent:
                await websocket.send_text(json.dumps(players))
                dt = await websocket.receive_text()
                data = json.loads(dt)
                #print(data)
                for player in players:
                    if player["id"] == player_id:
                        player["x"] += data["direction"]["x"]
                        player["y"] += data["direction"]["y"]
                time.sleep(.001)
            else:
                await websocket.send_text(json.dumps({"id": player_id}))
                id_sent = True

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
    uvicorn.run(app, host="0.0.0.0", port=8000)