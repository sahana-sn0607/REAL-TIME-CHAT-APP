// ---- Simple WebSocket Chat Server ----

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on("connection", ws => {
  console.log("A user connected");

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      ws.username = data.name;
      users.push(data.name);

      broadcast({
        type: "userList",
        users
      });

    } else if (data.type === "message") {
      broadcast({
        type: "chat",
        name: ws.username,
        text: data.text
      });
    }
  });

  ws.on("close", () => {
    users = users.filter(u => u !== ws.username);

    broadcast({
      type: "userList",
      users
    });
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log("WebSocket server running on ws://localhost:8080");
