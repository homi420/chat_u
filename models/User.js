import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  addedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  addedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chats" }],
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
