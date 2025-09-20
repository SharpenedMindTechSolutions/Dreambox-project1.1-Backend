import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Database/Db.js";
import authRoutes from "./Router/authRoutes.js";
import roadmapRoutes from "./Router/roadmapRoutes.js";
dotenv.config();

const app = express();
connectDB();

const allowedOrigins = process.env.CLIENT_lIVE_URL;
console.log("Allowed Origins:", allowedOrigins)

const corsOptions = {
  origin: function (origin, callback) { 
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
