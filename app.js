function App() {
  const [ws, setWs] = React.useState(null);
  const [name, setName] = React.useState("Guest");
  const [connected, setConnected] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [chat, setChat] = React.useState([]);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "userList") {
        setUsers(data.users);
      }
      if (data.type === "chat") {
        setChat((prev) => [...prev, data]);
      }
    };
  }, []);

  const joinChat = () => {
    ws.send(JSON.stringify({ type: "join", name }));
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    ws.send(JSON.stringify({
      type: "message",
      text: message
    }));

    setMessage("");
  };

  return (
    <div className="chat-card">
      <div className="header">
        <div>Real-Time Chat</div>
        <div>{connected ? "Connected" : "Connecting..."}</div>
      </div>

      <label>Your name:</label>
      <input value={name} onChange={e => setName(e.target.value)} />

      <button onClick={joinChat}>Join</button>

      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Chat:</label>
          <div className="chat-box">
            {chat.map((c, i) => (
              <p key={i}><b>{c.name}:</b> {c.text}</p>
            ))}
          </div>
        </div>

        <div className="users-section">
          <label>Users:</label>
          <div className="users-box">
            {users.map((u, i) => <p key={i}>{u}</p>)}
          </div>
        </div>
      </div>

      <input
        placeholder="Type your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
