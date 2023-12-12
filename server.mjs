import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { connectToDb } from "./utils/connectToDb.mjs";

// const socketHandler = require("./app/api/socket/socketServer");
import Chats from "./models/Chats.mjs";
const privateRooms = [];

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const updateChats = async (chatBetween, message, senderName) => {
  const { to, from } = chatBetween;
  await connectToDb();
  try {
    const Chat = await Chats.findOne({
      $or: [
        {
          "chatBetween.user1": to,
          "chatBetween.user2": from,
        },
        {
          "chatBetween.user1": from,
          "chatBetween.user2": to,
        },
      ],
    });
    if (Chat === null || Chat.length === 0) {
      await Chats.create({
        chatBetween: {
          user1: to,
          user2: from,
        },
        messages: [
          {
            message,
            senderName,
            senderId: from,
          },
        ],
      });
    } else {
      await Chats.findByIdAndUpdate(
        Chat._id,
        { $push: { messages: { message, senderId: from, senderName } } },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // socketHandler(io);
  io.on("connection", async (socket) => {
    socket.emit("socketId", socket.id);
    let connectedPerson;
    socket.on("userName", (userName) => {
      console.log(`${userName} connected`);
      connectedPerson = userName;
    });
    socket.on("createRoom", (data) => {
      const { to, from } = data;
      console.log("creating the room");
      const roomName = privateRooms[from] && privateRooms[from][to];
      if (!roomName) {
        const newRoomName = `roomBetween ${to} & ${from}`;
        privateRooms[from] = {
          ...privateRooms[from],
          [to]: newRoomName,
        };
        privateRooms[to] = {
          ...privateRooms[to],
          [from]: newRoomName,
        };
        console.log("joining the room");
        socket.join(newRoomName);
        console.log("room joined!");
      } else socket.join(roomName);
    });
    socket.on("getChatsRequest", async (id, callback) => {
      try {
        const chats = await Chats.find({
          $or: [{ "chatBetween.user1": id }, { "chatBetween.user2": id }],
        });
        if (!chats) {
          if (typeof callback === "function")
            callback({ status: 404, message: "Can't Find Chats" });
        }
        socket.emit("getChats", chats);
        socket.emit("showChats");
        if (typeof callback === "function") callback({ status: 200 });
      } catch (error) {
        console.log(error);
        if (typeof callback === "function")
          callback({ status: 500, message: "Internal Server Error!" });
      }
    });
    socket.on("message", async (data) => {
      const { message, to, from, senderName } = data;
      const roomName = privateRooms[from] && privateRooms[from][to];

      console.log(roomName);
      io.to(roomName).emit("messageFromServer", {
        message,
        senderId: socket.id,
        senderName,
      });
      await updateChats({ to, from }, message, senderName);
    });
    socket.on("disconnect", () => {
      console.log(connectedPerson + " Disconnected");
    });
  });
  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server Started at http://localhost:3000");
  });
});
