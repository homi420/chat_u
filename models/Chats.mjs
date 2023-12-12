import mongoose from "mongoose";
const { Schema, models, model } = mongoose;
const ChatsSchema = new Schema({
  chatBetween: {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  messages: [
    {
      message: String,
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      senderName: String,
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
const Chats = models.Chats || model("Chats", ChatsSchema);
export default Chats;
