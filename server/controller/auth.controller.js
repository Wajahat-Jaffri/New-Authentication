// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import hashValue from "../utils/hash.js";

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save User
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User Registered Successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// export const loginUser = async (req, res) => {
//   try {
//     const { email, password, deviceSecret } = req.body;

//     // Validation
//     if (!email || !password || !deviceSecret) {
//       return res.status(400).json({
//         success: false,
//         message: "Email, Password and Device Secret are required",
//       });
//     }

//     // Find User
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Credentials",
//       });
//     }

//     // Compare Password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Credentials",
//       });
//     }

//     // Hash Device Secret
//     const deviceHash = hashValue(deviceSecret);

//     // Save Device Hash
//     user.deviceHash = deviceHash;

//     await user.save();

//     // Create JWT
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         deviceHash,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // Cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Login Successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// export const logoutUser = (req, res) => {
//   res.clearCookie("token");

//   res.status(200).json({
//     success: true,
//     message: "Logout Successful",
//   });
// };


// export const checkAuth = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import hashValue from "../utils/hash.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";

// Cookie helper configuration
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge,
});

// 1. REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, devices: [] });

    res.status(201).json({ success: true, message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGIN (Multi-device support)
export const loginUser = async (req, res) => {
  try {
    const { email, password, deviceSecret } = req.body;
    const userAgent = req.headers["user-agent"] || "Unknown Device";

    if (!email || !password || !deviceSecret) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const deviceHash = hashValue(deviceSecret);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Pehle se agar yeh device array me hai to use hata do (Session Overwrite)
    user.devices = user.devices.filter(d => d.deviceHash !== deviceHash);

    // Naya device session push karo
    user.devices.push({ deviceHash, refreshToken, userAgent });
    await user.save();

    // Dono Cookies send karo
    res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000)); // 15 Min
    res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 Days

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. REFRESH TOKEN (Jadu jo user ko logout nahi hone deta)
export const refreshTokens = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    const deviceSecret = req.headers["x-device-secret"];

    if (!incomingRefreshToken || !deviceSecret) {
      return res.status(401).json({ success: false, message: "Tokens/Headers Missing" });
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    const deviceHash = hashValue(deviceSecret);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Find token inside database devices array
    const activeDevice = user.devices.find(d => d.deviceHash === deviceHash && d.refreshToken === incomingRefreshToken);
    
    if (!activeDevice) {
      // Security Alert: Agar token reuse ki koshish ho, to saare devices logout kar do! (Token Rotation Security)
      user.devices = [];
      await user.save();
      return res.status(403).json({ success: false, message: "Security Breach! All devices logged out." });
    }

    // Naye tokens banao (Token Rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // DB me refresh token update karo
    activeDevice.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, cookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", newRefreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(200).json({ success: true, message: "Token Refreshed Successfully" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or Expired Refresh Token" });
  }
};

// 4. LOGOUT CURRENT DEVICE
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Sirf us device ko nikalo jiska hash match ho rha hai
    user.devices = user.devices.filter(d => d.deviceHash !== req.currentDeviceHash);
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out from current device" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. LOGOUT ALL DEVICES (Remote Logout)
export const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.devices = []; // Array bilkul khali!
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out from all devices successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. CHECK AUTH
export const checkAuth = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};