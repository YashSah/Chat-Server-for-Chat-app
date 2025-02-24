const WebSocket = require("ws");
const connectDb = require("./database/mongoDB");
const ChatMessage = require("./models/chatMessage");

// Start server with MongoDB connection
const startServer = async () => {
  try {
    await connectDb(); // Wait for MongoDB connection

    const wss = new WebSocket.Server({ port: 8081 });

    wss.on("connection", async (ws) => {
      console.log("New client connected");

      // Send chat history to the new client
      try {
        const history = await ChatMessage.find()
          .sort({ timestamp: 1 }) // Oldest first
          .limit(50); // Last 50 messages
        const historyResponse = JSON.stringify({
          type: "history",
          data: history.map((msg) => ({
            username: msg.username,
            content: msg.content,
            id: msg.id,
          })),
        });
        ws.send(historyResponse);
        console.log("Sent history to new client");
      } catch (err) {
        console.error("Error fetching history:", err.message);
      }

      ws.on("message", async (message) => {
        console.log(`Received: ${message}`);
        try {
          const parsed = JSON.parse(message);

          // Save to MongoDB
          const chatMessage = new ChatMessage({
            username: parsed.username,
            content: parsed.content,
            id: parsed.id,
          });
          await chatMessage.save();
          console.log("Message saved to MongoDB");

          // Broadcast to all clients
          const response = JSON.stringify({
            type: "message",
            data: {
              username: parsed.username,
              content: parsed.content,
              id: parsed.id,
            },
          });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(response);
            }
          });
        } catch (err) {
          console.error("Error processing message:", err.message);
        }
      });

      ws.on("close", () => console.log("Client disconnected"));
    });

    console.log("WebSocket server running on ws://localhost:8081");
  } catch (err) {
    console.error("Server startup error:", err.message);
    process.exit(1);
  }
};

// Start the server
startServer();
