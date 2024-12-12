const socket = new WebSocket("ws://192.168.1.48:8000/ws");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = {};
let direction = { x: 0, y: 0 };
const speed = 1;
const activeKeys = {}; // Object to track active keys
let idreceive = false
let id = null

socket.onmessage = (event) => {
  if (idreceive){
    players = JSON.parse(event.data);
    socket.send(JSON.stringify({ direction }));
    renderGame();
    console.log(players)
  }
  else {
    id = JSON.parse(event.data)["id"]
    console.log("received id")
    console.log(id)
    idreceive = true
  }
};

document.addEventListener('keydown', (event) => {
  activeKeys[event.key] = true; // Mark the key as active
  updateDirection(); // Update the direction based on active keys
});

document.addEventListener('keyup', (event) => {
  activeKeys[event.key] = false; // Mark the key as inactive
  updateDirection(); // Update the direction based on active keys
});

// Update direction based on active keys
function updateDirection() {
  direction = { x: 0, y: 0 };
  if (activeKeys['ArrowLeft']) direction.x -= speed;
  if (activeKeys['ArrowRight']) direction.x += speed;
  if (activeKeys['ArrowUp']) direction.y -= speed;
  if (activeKeys['ArrowDown']) direction.y += speed;
}

function renderGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let localPlayer = players.find(player => player.id === id);
  if (!localPlayer) return;

  // Draw local player at the center of the screen
  ctx.beginPath();
  ctx.arc(650, 400, 20, 0, 2 * Math.PI); // Draw circle
  ctx.fillStyle = "#0000FF"; // Color blue
  ctx.fill();

  // Draw other players
  players.forEach(player => {
    if (player.id !== id) {
      let relativeX = player.x - localPlayer.x;
      let relativeY = player.y - localPlayer.y;

      let screenX = 650 + relativeX;
      let screenY = 400 + relativeY;

      // Check if the player is within the screen bounds
      if (screenX >= 0 && screenX <= 1300 && screenY >= 0 && screenY <= 800) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, 20, 0, 2 * Math.PI); // Draw circle
        ctx.fillStyle = "#0000FF"; // Color red for other players
        ctx.fill();
      }
    }
  });
}

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket closed");
};
