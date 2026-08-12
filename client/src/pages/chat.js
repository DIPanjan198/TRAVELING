import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../App";
import { API_BASE } from "../utils/api";
import "./chat.css";

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const socket = useSocket();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
  }, [navigate]);

  // Fetch users & connections
  useEffect(() => {
    const loadChatData = async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      try {
        const usersRes = await fetch(`${API_BASE}/api/users`);
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setAllUsers(usersData);
        }

        const connRes = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
        const connData = await connRes.json();
        if (Array.isArray(connData)) {
          setConnections(connData);
        }
      } catch (err) {
        console.error("Failed to load chat data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) loadChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // Derived accepted buddies
  const buddies = connections
    .filter(c => c.status === "accepted")
    .map(c => {
      if (!c.sender || !c.receiver) return null;
      return c.sender._id === currentUser?._id ? c.receiver : c.sender;
    })
    .filter(Boolean);

  // Determine active buddy:
  // Try to find the user in allUsers matching ID from the route.
  // If it matches currentUser, or doesn't match any user, fallback to the first accepted buddy.
  const routeBuddy = allUsers.find(u => u._id === id);
  const activeBuddy = (routeBuddy && routeBuddy._id !== currentUser?._id) 
    ? routeBuddy 
    : (buddies.length > 0 ? buddies[0] : null);

  // Check if they are connected
  const isConnected = activeBuddy ? buddies.some(b => b._id === activeBuddy._id) : false;

  // Set active buddy and join room (only if connected)
  useEffect(() => {
    if (!activeBuddy || !currentUser || !socket || !isConnected) return;

    // Create a unique room ID by sorting user IDs
    const roomId = [currentUser._id, activeBuddy._id].sort().join("_");
    socket.emit("join", roomId);

    // Fetch message history
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/${currentUser._id}/${activeBuddy._id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBuddy?._id, currentUser?._id, socket, isConnected]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !currentUser || !activeBuddy || !isConnected) return;

    const handleReceiveMessage = (newMessage) => {
      // Only append if it belongs to the current conversation
      if (
        (newMessage.sender === currentUser._id && newMessage.receiver === activeBuddy._id) ||
        (newMessage.sender === activeBuddy._id && newMessage.receiver === currentUser._id)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser?._id, activeBuddy?._id, isConnected]);

  // Auto scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket || !currentUser || !activeBuddy || !isConnected) return;

    const roomId = [currentUser._id, activeBuddy._id].sort().join("_");
    
    const messageData = {
      senderId: currentUser._id,
      receiverId: activeBuddy._id,
      text: messageText.trim(),
      roomId: roomId
    };

    // Emit to socket
    socket.emit("sendMessage", messageData);
    setMessageText("");
  };

  const renderAvatar = (avatarValue) => {
    if (avatarValue && avatarValue.startsWith("data:")) {
      return <img src={avatarValue} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}/>;
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "60%", height: "60%", color: "var(--text-secondary)" }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  };

  if (!currentUser || loading) {
    return (
      <div className="chat-container">
        <div className="chat-loader">
          <div className="spinner"></div>
          <p style={{ marginLeft: "12px" }}>Loading Aero conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Mobile topbar toggle button */}
      <div className="chat-mobile-bar">
        <button 
          className="chat-mobile-buddy-toggle" 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          💬 {mobileSidebarOpen ? "Close List" : "Conversations"}
        </button>
        <span className="chat-mobile-active-name">
          {activeBuddy ? activeBuddy.name : "No active chat"}
        </span>
      </div>

      {/* Sidebar List */}
      <aside className={`chat-sidebar glass-panel ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h3>Active Chats</h3>
          <span className="chat-conn-count">{buddies.length} Connections</span>
        </div>
        <div className="buddy-list">
          {buddies.length > 0 ? (
            buddies.map(buddy => (
              <div 
                key={buddy._id} 
                className={`buddy-item ${activeBuddy && activeBuddy._id === buddy._id ? "active" : ""}`}
                onClick={() => {
                  setMobileSidebarOpen(false);
                  navigate(`/chat/${buddy._id}`);
                }}
              >
                <div className="buddy-avatar-circle">
                  {renderAvatar(buddy.avatar)}
                </div>
                <div className="buddy-item-info">
                  <h4>{buddy.name}</h4>
                  <p>📍 {buddy.destination || "Anywhere"}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No connected users yet. Go connect in the AI Matcher first!
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main glass-panel">
        {activeBuddy ? (
          <>
            <header className="chat-header">
              <div className="chat-header-user">
                <div className="buddy-avatar-circle">{renderAvatar(activeBuddy.avatar)}</div>
                <div>
                  <h3>{activeBuddy.name}</h3>
                  <p className={isConnected ? "pulse-green" : "text-muted"}>
                    {isConnected ? "Connected" : "Request Pending/Unconnected"}
                  </p>
                </div>
              </div>
              <button className="btn btn-glass" onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </button>
            </header>

            {isConnected ? (
              <>
                <div className="chat-messages-area">
                  {messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      const isUser = msg.sender === currentUser._id;
                      return (
                        <div key={msg._id || idx} className={`message-wrapper ${isUser ? "user" : "buddy"}`}>
                          {!isUser && <div className="msg-avatar-icon">{renderAvatar(activeBuddy.avatar)}</div>}
                          <div className="message-bubble">
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                      👋 Start of your journey conversation with {activeBuddy.name}. Say hello!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-row">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={`Send message to ${activeBuddy.name}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="connection-required-panel">
                <div className="warning-icon">🔒</div>
                <h3>Connection Required</h3>
                <p>You must establish an accepted connection with <strong>{activeBuddy.name}</strong> to chat.</p>
                <button className="btn btn-primary" onClick={() => navigate("/matching")} style={{ padding: "12px 24px" }}>
                  Find Matches & Connect
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="chat-empty-state">
            <div className="chat-logo-placeholder">✈️</div>
            <h3>Your Conversations</h3>
            <p>Connect with travel buddies in matching section to build real connections and unlock messaging.</p>
            <button className="btn btn-primary" onClick={() => navigate("/matching")} style={{ padding: "12px 24px" }}>
              Find Vibe Matches
            </button>
          </div>
        )}
      </main>

      {/* Right Details Panel */}
      {activeBuddy && (
        <aside className="chat-profile-panel glass-panel">
          <div className="profile-panel-header">
            <div className="profile-panel-avatar">{renderAvatar(activeBuddy.avatar)}</div>
            <h3>{activeBuddy.name}</h3>
            <span className={`badge ${isConnected ? "badge-emerald" : "badge-indigo"}`}>
              {isConnected ? "Connected Partner" : "Not Connected"}
            </span>
          </div>

          <div className="profile-details-body">
            <div className="profile-detail-group">
              <label>Target Destination</label>
              <span className="badge badge-emerald">📍 {activeBuddy.destination || "Anywhere"}</span>
            </div>

            <div className="profile-detail-group">
              <label>Travel Vibe & Budget</label>
              <div className="pref-badges">
                <span className="badge badge-purple" style={{ marginBottom: "6px" }}>🎒 {activeBuddy.travelStyle || "Flexible"}</span>
                <span className="badge badge-indigo">💰 {activeBuddy.budget || "Flexible"} Budget</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Chat;