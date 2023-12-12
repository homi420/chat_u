const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const Chats = require("../models/Chats.mjs").default;
const connectToDb = require("../utils/commonJsConnectToDb");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const privateRooms = [];
const updateChats = async (chatBetween, message) => {
  const { to, from } = chatBetween;
  await connectToDb();
  try {
    const Chat = await Chats.findOne({
      chatBetween: { user1: to, user2: from },
    });

    if (!Chat || !Chat.length) {
      await Chats.create({
        chatBetween: {
          user1: to,
          user2: from,
        },
        messages: [
          {
            message,
            senderId: from,
          },
        ],
      });
    } else {
      await Chats.findByIdAndUpdate(
        Chat._id,
        { $push: { messages: { message, senderId: from } } },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
io.on("connection", async (socket) => {
  socket.emit("socketId", socket.id);
  let connectedPerson;
  socket.on("userName", (userName) => {
    console.log(`${userName} connected`);
    connectedPerson = userName;
  });
  socket.on("message", (data) => {
    const { message, to, from } = data;
    const roomName = privateRooms[from] && privateRooms[from][to];
    if (!roomName) {
      const newRoomName = `roomBetween${to}&${from}`;
      privateRooms[from] = {
        ...privateRooms[from],
        [to]: newRoomName,
      };
      privateRooms[to] = {
        ...privateRooms[to],
        [to]: newRoomName,
      };
      socket.join(newRoomName);
    } else {
      socket.join(roomName);
    }
    io.to(roomName).emit("messageFromServer", {
      message,
      senderId: socket.id,
      senderName: connectedPerson,
    });
    updateChats({ to, from }, message);
  });
  socket.on("disconnect", () => {
    console.log(connectedPerson + " Disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("socket server connected");
});
