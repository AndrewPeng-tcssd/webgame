const socket = new WebSocket("ws://localhost:8000/ws");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = [];
let direction = { x: 0, y: 0 };
const speed = 1;
const activeKeys = {}; // Object to track active keys
let idReceived = false;
let id = null;

socket.onmessage = (event) => {
  if (idReceived) {
    players = JSON.parse(event.data);
    socket.send(JSON.stringify({ direction }));
    renderGame();
    console.log(players);
  } else {
    const data = JSON.parse(event.data);
    id = data.id;
    console.log("Received ID:", id);
    idReceived = true;
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
  // Clear the canvas with a white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Get local player
  const localPlayer = players.find(player => player.id === id);
  if (!localPlayer) return;

  // Draw the grid, offset by the player's position
  drawGrid(localPlayer);

  // Draw local player at the center of the screen
  ctx.beginPath();
  ctx.arc(650, 400, 20, 0, 2 * Math.PI); // Draw circle
  ctx.fillStyle = localPlayer.color; // Color blue
  ctx.fill();
  
  // Render local player coordinates
  ctx.fillStyle = "black"; // Set color for text
  ctx.font = "14px Arial"; // Text font and size
  ctx.fillText(`Coordinates: (${((localPlayer.x.toFixed(2) - 650)/100).toFixed(0)}, ${((localPlayer.y.toFixed(2) - 400)/100).toFixed(0)})`, 10, 20); // Render player coordinates at the top-left corner

  // Draw other players
  players.forEach(player => {
    if (player.id !== id) {
      let relativeX = player.x - localPlayer.x;
      let relativeY = player.y - localPlayer.y;

      let screenX = 650 + relativeX;
      let screenY = 400 + relativeY;

      // Check if the player is within the screen bounds
      if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, 20, 0, 2 * Math.PI); // Draw circle
        ctx.fillStyle = player.color; 
        ctx.fill();
      }
    }
  });
}

function drawGrid(localPlayer) {
  const gridSize = 50; // Size of each grid cell
  ctx.strokeStyle = "#444"; // Light gray color for the grid
  ctx.lineWidth = 1;

  // Calculate offsets for the grid based on the player's position
  const offsetX = -localPlayer.x % gridSize;
  const offsetY = -localPlayer.y % gridSize;

  // Draw vertical lines
  for (let x = offsetX; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = offsetY; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket closed");
};
