const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");


const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());

/* ===================== MONGODB CONNECTION ===================== */
mongoose
  .connect(
    "mongodb+srv://dbUser:Dip123@cluster0.oac2x82.mongodb.net/travelbuddy?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

/* ===================== USER SCHEMA ===================== */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    default: "",
  },

  budget: {
    type: String,
    default: "",
  },

  travelStyle: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", UserSchema);

/* ===================== HOME ROUTE ===================== */
app.get("/", (req, res) => {
  res.send("🚀 Travel Buddy Finder Backend Running");
});

/* ===================== REGISTER ===================== */
app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      destination,
      budget,
      travelStyle,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      destination,
      budget,
      travelStyle,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===================== GET ALL USERS ===================== */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===================== LOGIN ===================== */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        destination: user.destination,
        budget: user.budget,
        travelStyle: user.travelStyle,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Login error",
    });
  }
});

/* ===================== FORGOT PASSWORD ===================== */
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Password reset error",
    });
  }
});

/* ===================== START SERVER ===================== */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});





