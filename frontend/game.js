const socket = new WebSocket("ws://127.0.0.1:8000/ws");

let players = {}

socket.onopen = () => {
  console.log("WebSocket connected");
  socket.send(JSON.stringify({ text: "send" }));
};

socket.onmessage = (event) => {
  //console.log("Message received:", event.data);
  players = JSON.parse(event.data);
  console.log(players[0])
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket closed");
};
