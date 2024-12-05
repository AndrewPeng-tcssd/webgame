const socket = new WebSocket("ws://127.0.0.1:8000/ws");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d')

let players = {}
let direction = {x: 0, y: 0}
let speed = 0.5

socket.onmessage = (event) => {
  //console.log("Message received:", event.data);
  players = JSON.parse(event.data);
  socket.send(JSON.stringify({ "direction": direction }));
  console.log(players[0])
  renderGame()
};


document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') direction = { x: -speed, y: 0 };
  if (event.key === 'ArrowRight') direction = { x: speed, y: 0 };
  if (event.key === 'ArrowUp') direction = { x: 0, y: -speed };
  if (event.key === 'ArrowDown') direction = { x: 0, y: speed }; 
})

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') direction = {x: 0, y: 0}
  if (event.key === 'ArrowRight') direction = {x: 0, y: 0}
  if (event.key === 'ArrowUp') direction = {x: 0, y: 0}
  if (event.key === 'ArrowDown') direction = {x: 0, y: 0}
})

function renderGame() {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height)
  ctx.beginPath();
  for (let i = 0; i < players.length; i++){
    ctx.arc(players[i].x, players[i].y, 20, 0, 2 * Math.PI); // circle
    ctx.fillStyle = "#0000FF"; // color blue
    ctx.fill()
  }
}

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket closed");
};
