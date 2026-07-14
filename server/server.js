// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";

// dotenv.config();

// connectDB();

// const app = express();

// app.use(express.json());

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.get("/", (req, res) => {
//   res.send("API Running...");
// });

// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server Running on ${PORT}`);
// });


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";

// dotenv.config();
// connectDB();

// const app = express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173", // Apne frontend ka URL rakhein
//   credentials: true,
// }));

// // Main routes mapping
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Production Level Security API Running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server Running on Port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL // Baad mein jab frontend deploy karein toh ye .env me daal dena
];

// Pehle wale CORS middleware ko replace kar ke ye lagayein:
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Preflight/OPTIONS request ko Express level par bypass karne ke liye middleware:
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-device-secret");
  res.sendStatus(200);
});

// Main routes mapping
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Production Level Security API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});