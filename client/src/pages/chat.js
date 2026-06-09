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
  const [buddies, setBuddies] = useState([]);
  const [activeBuddy, setActiveBuddy] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

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

  // Fetch all users for the sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`);
        const data = await res.json();
        if (currentUser) {
          setBuddies(data.filter(u => u._id !== currentUser._id));
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    if (currentUser) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // Set active buddy and join room
  useEffect(() => {
    if (!buddies.length || !currentUser || !socket) return;

    const buddy = buddies.find(b => b._id === id) || buddies[0];
    setActiveBuddy(buddy);

    if (!buddy) return;

    // Create a unique room ID by sorting user IDs
    const roomId = [currentUser._id, buddy._id].sort().join("_");
    socket.emit("join", roomId);

    // Fetch message history
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
      // Only append if it belongs to the current conversation
      if (
        (newMessage.sender === currentUser._id && newMessage.receiver === activeBuddy?._id) ||
        (newMessage.sender === activeBuddy?._id && newMessage.receiver === currentUser._id)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUser?._id, activeBuddy?._id]);


  // Auto scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket || !currentUser || !activeBuddy) return;

    const roomId = [currentUser._id, activeBuddy._id].sort().join("_");
    
    const messageData = {
      senderId: currentUser._id,
      receiverId: activeBuddy._id,
      text: messageText.trim(),
      roomId: roomId
    };

    // Emit to socket (the server will broadcast it back to the room, so we don't optimistically update here to prevent duplicates)
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

  if (!currentUser || !buddies.length || !activeBuddy) {
    return <div className="chat-container"><div className="loader">Loading Chat...</div></div>;
  }

  return (
    <div className="chat-container">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Sidebar List */}
      <aside className="chat-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>My Conversations</h3>
        </div>
        <div className="buddy-list">
          {buddies.map(buddy => (
            <div 
              key={buddy._id} 
              className={`buddy-item ${activeBuddy._id === buddy._id ? "active" : ""}`}
              onClick={() => navigate(`/chat/${buddy._id}`)}
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
      <main className="chat-main glass-panel">
        <header className="chat-header">
          <div className="chat-header-user">
            <div className="buddy-avatar-circle">{renderAvatar(activeBuddy.avatar)}</div>
            <div>
              <h3>{activeBuddy.name}</h3>
              <p className="pulse-green">Active Now</p>
            </div>
          </div>
          <button className="btn btn-glass" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </header>

        <div className="chat-messages-area">
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
            placeholder={`Send message to ${activeBuddy.name}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </main>

      {/* Right Details Panel */}
      <aside className="chat-profile-panel glass-panel">
        <div className="profile-panel-header">
          <div className="profile-panel-avatar">{renderAvatar(activeBuddy.avatar)}</div>
          <h3>{activeBuddy.name}</h3>
          <span className="badge badge-indigo">Partner Profile</span>
        </div>

        <div className="profile-details-body">
          <div className="profile-detail-group">
            <label>Destination Match</label>
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
    </div>
  );
}

export default Chat;