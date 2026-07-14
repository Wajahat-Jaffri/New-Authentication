// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     deviceHash: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceHash: { type: String, required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String, default: "" }, // Browser/Device info ke liye
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    devices: [deviceSchema], // Array of active devices
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;