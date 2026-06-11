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
  const [buddies, setBuddies] = useState([]);          // only accepted connections
  const [activeBuddy, setActiveBuddy] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(userStr));
  }, [navigate]);

  // Fetch ONLY accepted connections (not all users)
  useEffect(() => {
    const fetchConnectedBuddies = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`${API_BASE}/api/connections/${currentUser._id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Keep only accepted connections and extract the other user
          const acceptedBuddies = data
            .filter(c => c.status === "accepted")
            .map(c => {
              // Return the OTHER user in the connection (not the current user)
              return c.sender._id === currentUser._id ? c.receiver : c.sender;
            });
          setBuddies(acceptedBuddies);
        }
      } catch (err) {
        console.error("Failed to load connections:", err);
      }
    };
    if (currentUser) fetchConnectedBuddies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // Set active buddy and join room
  useEffect(() => {
    if (!buddies.length || !currentUser || !socket) return;

    const buddy = buddies.find(b => b._id === id) || buddies[0];
    setActiveBuddy(buddy);

    if (!buddy) return;

    const roomId = [currentUser._id, buddy._id].sort().join("_");
    socket.emit("join", roomId);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/${currentUser._id}/${buddy._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, buddies, currentUser?._id, socket]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      if (
        (newMessage.sender === currentUser._id && newMessage.receiver === activeBuddy?._id) ||
        (newMessage.sender === activeBuddy?._id && newMessage.receiver === currentUser._id)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => { socket.off("receiveMessage", handleReceiveMessage); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser?._id, activeBuddy?._id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket || !currentUser || !activeBuddy) return;

    const roomId = [currentUser._id, activeBuddy._id].sort().join("_");
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: activeBuddy._id,
      text: messageText.trim(),
      roomId
    });
    setMessageText("");
  };

  const renderAvatar = (avatarValue, size = "100%") => {
    if (avatarValue && avatarValue.startsWith("data:")) {
      return <img src={avatarValue} alt="Avatar" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: "60%", height: "60%", color: "var(--text-secondary)" }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  };

  // Loading state
  if (!currentUser) {
    return <div className="chat-container"><div className="chat-loader">Loading...</div></div>;
  }

  // No connections at all
  if (currentUser && buddies.length === 0) {
    return (
      <div className="chat-container chat-no-connections">
        <div className="bg-blob blob-primary" />
        <div className="bg-blob blob-secondary" />
        <div className="no-connections-panel glass-panel">
          <div className="no-conn-icon">💬</div>
          <h2>No Conversations Yet</h2>
          <p>
            You need to connect with travel buddies first before you can chat.
            Head to the AI Matcher to find and connect with travelers heading to your destination!
          </p>
          <div className="no-conn-actions">
            <button className="btn btn-primary" onClick={() => navigate("/matching")}>
              🤝 Find Matches
            </button>
            <button className="btn btn-glass" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Mobile buddy list toggle bar */}
      {buddies.length > 0 && (
        <div className="chat-mobile-bar">
          <button
            className="chat-mobile-buddy-toggle"
            onClick={() => setMobileSidebarOpen(v => !v)}
          >
            {mobileSidebarOpen ? "✕ Close" : `💬 Conversations (${buddies.length})`}
          </button>
          {activeBuddy && (
            <span className="chat-mobile-active-name">{activeBuddy.name}</span>
          )}
        </div>
      )}

      {/* Conversations sidebar — connected buddies only */}
      <aside className={`chat-sidebar glass-panel ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h3>My Conversations</h3>
          <span className="chat-conn-count">{buddies.length} connected</span>
        </div>
        <div className="buddy-list">
          {buddies.map(buddy => (
            <div
              key={buddy._id}
              className={`buddy-item ${activeBuddy?._id === buddy._id ? "active" : ""}`}
              onClick={() => {
                navigate(`/chat/${buddy._id}`);
                setMobileSidebarOpen(false);
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
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      {activeBuddy ? (
        <main className="chat-main glass-panel">
          <header className="chat-header">
            <div className="chat-header-user">
              <div className="buddy-avatar-circle">{renderAvatar(activeBuddy.avatar)}</div>
              <div>
                <h3>{activeBuddy.name}</h3>
                <p className="pulse-green">Active Now</p>
              </div>
            </div>
            <button className="btn btn-glass chat-back-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
          </header>

          <div className="chat-messages-area">
            {messages.length === 0 && (
              <div className="chat-empty-state">
                <p>No messages yet. Say hello to {activeBuddy.name}! 👋</p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isUser = msg.sender === currentUser._id;
              return (
                <div key={msg._id || idx} className={`message-wrapper ${isUser ? "user" : "buddy"}`}>
                  {!isUser && <div className="msg-avatar-icon">{renderAvatar(activeBuddy.avatar)}</div>}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-row">
            <input
              type="text"
              className="form-input"
              placeholder={`Message ${activeBuddy.name}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </main>
      ) : (
        <main className="chat-main glass-panel chat-select-buddy">
          <p>Select a conversation from the left to start chatting.</p>
        </main>
      )}

      {/* Right Profile Panel */}
      {activeBuddy && (
        <aside className="chat-profile-panel glass-panel">
          <div className="profile-panel-header">
            <div className="profile-panel-avatar">{renderAvatar(activeBuddy.avatar)}</div>
            <h3>{activeBuddy.name}</h3>
            <span className="badge badge-indigo">Travel Buddy</span>
          </div>
          <div className="profile-details-body">
            <div className="profile-detail-group">
              <label>Destination</label>
              <span className="badge badge-emerald">📍 {activeBuddy.destination || "Anywhere"}</span>
            </div>
            <div className="profile-detail-group">
              <label>Travel Preferences</label>
              <div className="pref-badges">
                <span className="badge badge-purple">🎒 {activeBuddy.travelStyle || "Flexible"}</span>
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