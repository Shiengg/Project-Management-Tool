const { Server } = require("socket.io");

let io = null;
const connectedUsers = new Map(); 
const connectedRooms = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });


  });
}

module.exports = {
  initializeSocket,
  getIO: () => io,
  connectedUsers,
  connectedRooms,
};
