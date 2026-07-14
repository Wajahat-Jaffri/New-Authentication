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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});