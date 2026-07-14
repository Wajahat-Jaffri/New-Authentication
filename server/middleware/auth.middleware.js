// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import hashValue from "../utils/hash.js";

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // 1. Cookie se token lo
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token Not Found",
//       });
//     }

//     // 2. Header se Device Secret lo
//     const deviceSecret = req.headers["x-device-secret"];

//     if (!deviceSecret) {
//       return res.status(401).json({
//         success: false,
//         message: "Device Secret Missing",
//       });
//     }

//     // 3. JWT Verify
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 4. Incoming Device Secret Hash
//     const incomingHash = hashValue(deviceSecret);

//     // 5. JWT ke andar wale hash se compare
//     if (incomingHash !== decoded.deviceHash) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized Device",
//       });
//     }

//     // 6. Database se user nikalo
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }

//     // 7. Database ke hash se bhi compare karo
//     if (user.deviceHash !== incomingHash) {
//       return res.status(401).json({
//         success: false,
//         message: "Device Mismatch",
//       });
//     }

//     // 8. User req me attach karo
//     req.user = user;

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };



import jwt from "jsonwebtoken";
import User from "../models/User.js";
import hashValue from "../utils/hash.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const deviceSecret = req.headers["x-device-secret"];

    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Access Token Missing" });
    }
    if (!deviceSecret) {
      return res.status(401).json({ success: false, message: "Device Secret Missing" });
    }

    // Access Token Verify karo
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    const incomingHash = hashValue(deviceSecret);

    // Database se user nikal kar check karo kya yeh device sach me allowed hai?
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    const deviceExists = user.devices.some(d => d.deviceHash === incomingHash);
    if (!deviceExists) {
      return res.status(401).json({ success: false, message: "Device Unauthorized or Logged Out" });
    }

    req.user = user;
    req.currentDeviceHash = incomingHash; // Aage controllers me use karne ke liye
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Access Token Expired or Invalid" });
  }
};