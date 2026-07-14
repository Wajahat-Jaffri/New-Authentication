// import express from "express";

// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   checkAuth,
// } from "../controller/auth.controller.js";

// import { authMiddleware } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.post("/logout", logoutUser);

// router.get("/check-auth", authMiddleware, checkAuth);

// export default router;


import express from "express";
import { 
  registerUser, 
  loginUser, 
  refreshTokens, 
  logoutUser, 
  logoutAllDevices, 
  checkAuth 
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokens);

// Protected Routes (Inme Security Guard khada hai)
router.get("/check-auth", authMiddleware, checkAuth);
router.post("/logout", authMiddleware, logoutUser);
router.post("/logout-all", authMiddleware, logoutAllDevices);

export default router;