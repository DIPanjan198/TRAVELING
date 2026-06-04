const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-site.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://dbUser:Dip123@cluster0.oac2x82.mongodb.net/travelbuddy?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  destination: String,
  budget: String,
  travelStyle: String,
});

const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* REGISTER */

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

    const existingUser = await User.findOne({ email });

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
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* LOGIN */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* USERS */

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select(
      "-password"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* MATCH USERS */

app.post("/api/match-users", async (req, res) => {
  try {
    const {
      destination,
      budget,
      travelStyle,
    } = req.body;

    const users = await User.find({
      destination: {
        $regex: destination,
        $options: "i",
      },
      budget,
      travelStyle,
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});