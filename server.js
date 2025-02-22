const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    const parsed = JSON.parse(message);
    const response = JSON.stringify({
      type: "message",
      data: {
        username: parsed.username,
        content: parsed.content,
        id: parsed.id, // Pass ID back
      },
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(response);
      }
    });
  });
  ws.on("close", () => console.log("Client disconnected"));
});

console.log("WebSocket server running on ws://localhost:8080");
