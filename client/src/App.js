import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ExploreDestinations from "./pages/ExploreDestinations";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import FindTravelBuddies from "./pages/FindTravelBuddies";
import DestinationMatching from "./pages/DestinationMatching";
import Chat from "./pages/chat";
import BudgetEstimator from "./pages/BudgetEstimator";
import { io } from "socket.io-client";
import { API_BASE } from "./utils/api";
import "./App.css";

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync currentUser state with localStorage when route/login state changes
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?._id !== currentUser?._id) {
      setCurrentUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentUser?._id]);

  // Manage socket connection lifecycle based purely on currentUser state changes
  useEffect(() => {
    if (currentUser) {
      const newSocket = io(API_BASE);
      newSocket.emit("registerUser", currentUser._id);
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // Handle incoming notification events
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      // Do not trigger toast if the user is currently on the sender's chat page
      const chatPath = `/chat/${data.senderId}`;
      if (location.pathname === chatPath) {
        return;
      }

      // Show floating toast
      setToast(data);

      // Play system notification chime
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
        audio.volume = 0.4;
        audio.play();
      } catch (e) {
        // Browser might block audio play before user interaction
      }
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [socket, location.pathname]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleToastClick = () => {
    if (toast) {
      navigate(`/chat/${toast.senderId}`);
      setToast(null);
    }
  };

  const renderAvatar = (avatarValue) => {
    if (avatarValue && avatarValue.startsWith("data:")) {
      return <img src={avatarValue} alt="Avatar" />;
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  };

  return (
    <SocketContext.Provider value={socket}>
      {children}

      {/* Floating Notification Toast */}
      {toast && (
        <div className="notification-toast" onClick={handleToastClick}>
          <div className="notification-avatar">
            {renderAvatar(toast.senderAvatar)}
          </div>
          <div className="notification-content">
            <h5>{toast.senderName}</h5>
            <p>{toast.text}</p>
          </div>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering navigation
              setToast(null);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </SocketContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="app-layout">
          {/* Sidebar locked on the left */}
          <Sidebar />

          {/* Content loaded on the right */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExploreDestinations />} />
              <Route path="/budget-estimator" element={<BudgetEstimator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route 
                path="/find-buddies" 
                element={
                  <ProtectedRoute>
                    <FindTravelBuddies />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/matching" 
                element={
                  <ProtectedRoute>
                    <DestinationMatching />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/chat/:id"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
