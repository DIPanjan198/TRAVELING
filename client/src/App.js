import ExploreDestinations from "./pages/ExploreDestinations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import FindTravelBuddies from "./pages/FindTravelBuddies";
import DestinationMatching from "./pages/DestinationMatching";
import About from "./pages/About";
import Features from "./pages/Features";
function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays on all pages */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/explore" element={<ExploreDestinations />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/find-buddies" element={ <ProtectedRoute> <FindTravelBuddies /></ProtectedRoute>}/>
         <Route path="/matching" element={<DestinationMatching />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        {/* Protected route (ADDED, NOT BREAKING ANYTHING) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




