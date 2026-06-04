const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */

mongoose
.connect(
"mongodb+srv://dbUser:Dip123@cluster0.oac2x82.mongodb.net/travelbuddy?retryWrites=true&w=majority"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err.message));

/* ================= USER SCHEMA ================= */

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

/* ================= HOME ================= */

app.get("/", (req, res) => {
res.send("🚀 Travel Buddy Finder Backend Running");
});

/* ================= TEST ROUTE ================= */

app.get("/api/match-users", (req, res) => {
res.json({
success: true,
message: "Match Users API Working",
});
});

/* ================= REGISTER ================= */

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

```
if (!name || !email || !password) {
  return res.status(400).json({
    message: "Name, Email and Password required",
  });
}

const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "User already exists",
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

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
  message: "User registered successfully",
  user,
});
```

} catch (err) {
console.log(err);

```
res.status(500).json({
  success: false,
  message: err.message,
});
```

}
});

/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {
try {
const { email, password } = req.body;

```
const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    message: "User not found",
  });
}

const validPassword = await bcrypt.compare(
  password,
  user.password
);

if (!validPassword) {
  return res.status(400).json({
    message: "Invalid password",
  });
}

res.json({
  success: true,
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
```

} catch (err) {
res.status(500).json({
message: err.message,
});
}
});

/* ================= USERS ================= */

app.get("/api/users", async (req, res) => {
try {
const users = await User.find().select("-password");

```
res.json(users);
```

} catch (err) {
res.status(500).json({
message: err.message,
});
}
});

/* ================= MATCH USERS ================= */

app.post("/api/match-users", async (req, res) => {
try {
const {
destination,
budget,
travelStyle,
} = req.body;

```
console.log("Search Request:", req.body);

if (
  !destination ||
  !budget ||
  !travelStyle
) {
  return res.status(400).json({
    message: "All fields required",
  });
}

const users = await User.find({
  destination: {
    $regex: new RegExp(destination, "i"),
  },

  budget: budget,

  travelStyle: travelStyle,
}).select("-password");

console.log("Matched Users:", users);

res.json(users);
```

} catch (err) {
console.log(err);

```
res.status(500).json({
  message: err.message,
});
```

}
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(
`🚀 Server Running on Port ${PORT}`
);
});
