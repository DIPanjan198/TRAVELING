const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://traveling-lac.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://traveling-lac.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelbuddy";

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log(`MongoDB Connected successfully to ${MONGO_URI}`))
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error("If you are using MongoDB Atlas, ensure your IP is whitelisted and the user credentials are correct.");
    console.error(err);
  });

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

  avatar: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", UserSchema);

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

const ConnectionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, { timestamps: true });

const Connection = mongoose.model("Connection", ConnectionSchema);

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
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    destination: user.destination,
    budget: user.budget,
    travelStyle: user.travelStyle,
    avatar: user.avatar
  }
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
/* MATCH USERS */
/* RECOMMENDED TRAVELERS */

app.get("/api/recommended/:id", async (req, res) => {
  try {

    const currentUser = await User.findById(
      req.params.id
    );

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const travelers = await User.find({

      _id: {
        $ne: currentUser._id
      },

      destination: {
        $regex: new RegExp(
          currentUser.destination,
          "i"
        )
      },

      budget: currentUser.budget,

      travelStyle: currentUser.travelStyle

    }).select("-password");

    res.json(travelers);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

app.post("/api/match-users", async (req, res) => {
  try {

    const {
      destination,
      budget,
      travelStyle
    } = req.body;

    const users = await User.find({

      destination: {
        $regex: new RegExp(destination, "i")
      },

      budget: budget,

      travelStyle: travelStyle

    }).select("-password");

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

/* UPDATE USER PROFILE */
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, destination, budget, travelStyle, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, destination, budget, travelStyle, avatar },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET CHAT MESSAGES */
app.get("/api/messages/:userId/:chatPartnerId", async (req, res) => {
  try {
    const { userId, chatPartnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: chatPartnerId },
        { sender: chatPartnerId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CONNECTION ENDPOINTS */
app.post("/api/connections/request", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });
    if (existing) {
      return res.status(400).json({ message: "Connection already exists or is pending" });
    }
    const connection = await Connection.create({ sender: senderId, receiver: receiverId, status: "pending" });
    res.status(201).json({ success: true, connection });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/connections/accept", async (req, res) => {
  try {
    const { connectionId } = req.body;
    const connection = await Connection.findByIdAndUpdate(connectionId, { status: "accepted" }, { new: true });
    res.json({ success: true, connection });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/connections/decline", async (req, res) => {
  try {
    const { connectionId } = req.body;
    await Connection.findByIdAndDelete(connectionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/connections/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const connections = await Connection.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).populate("sender", "name avatar destination budget travelStyle")
      .populate("receiver", "name avatar destination budget travelStyle");
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* SOCKET.IO CHAT IMPLEMENTATION */
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("registerUser", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} registered notification room: user_${userId}`);
  });

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined chat room ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, text, roomId } = data;
      
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        text: text
      });
      await newMessage.save();

      // Broadcast to everyone in the room (including sender to confirm)
      io.to(roomId).emit("receiveMessage", newMessage);

      // Fetch sender details to send along with the notification
      const sender = await User.findById(senderId).select("name avatar");
      const senderName = sender ? sender.name : "Travel Buddy";
      const senderAvatar = sender ? sender.avatar : "";

      // Emit notification to receiver's personal room
      io.to(`user_${receiverId}`).emit("newMessageNotification", {
        senderId,
        senderName,
        senderAvatar,
        text
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});