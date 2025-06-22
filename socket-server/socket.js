const { Server } = require("socket.io");
const { NOTIFICATION_CHANNEL, PROJECT_CHANNEL } = require("./constant/channel");

let io = null;
const connectedUsers = new Map(); // user.id -> socket.id

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
      for (const [userId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`Removed userId ${userId} from connectedUsers`);
          break;
        }
      }
    });

    socket.on(NOTIFICATION_CHANNEL.JOIN, (id) => {
      console.log("User connected:", socket.id);
      connectedUsers.set(id, socket.id);
      io.to(socket.id).emit(PROJECT_CHANNEL.ADD_MEMBER, {
        id: "id" + Math.random() * 123,
        projectId: "123",
        projectName: "TEST",
        email: "test@gmail.com",
        createdAt: new Date(),
      });
    });

    socket.on(PROJECT_CHANNEL.JOIN_ROOM, (projectId) => {
      console.log(`User joined project:${projectId}`);
      socket.join(projectId);
    });

    socket.on(PROJECT_CHANNEL.LEAVE_ROOM, (projectId) => {
      console.log(`User left project:${projectId}`);

      socket.leave(projectId);
    });

    socket.on(PROJECT_CHANNEL.ASSIGN_ADMIN, ({ projectId, adminId }) => {
      console.log(
        `Assigning ${adminId} to be the new admin of project ${projectId}`
      );

      io.to(projectId).emit(PROJECT_CHANNEL.ASSIGN_ADMIN, adminId);
    });

    socket.on(
      PROJECT_CHANNEL.ADD_MEMBER,
      ({ projectId, projectName, userIds, email, createdAt, id }) => {
        userIds.forEach((userId) => {
          console.log(
            `Inviting ${userId?.toString()} to project: ${projectId}`
          );
          console.log(connectedUsers.get(userId))
          io.to(connectedUsers.get(userId)).emit(PROJECT_CHANNEL.ADD_MEMBER, {
            id,
            projectId,
            projectName,
            email,
            createdAt,
          });
        });
      }
    );

    socket.on(PROJECT_CHANNEL.JOIN_PROJECT, ({ projectId, user }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.JOIN_PROJECT, user);
    });

    socket.on(PROJECT_CHANNEL.LEAVE_PROJECT, ({ projectId, userId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.LEAVE_PROJECT, userId);
    });

    socket.on(PROJECT_CHANNEL.ADD_TASK, ({ projectId, newTask }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.ADD_TASK, newTask);
    });

    socket.on(PROJECT_CHANNEL.UPDATE_TASK, ({ projectId, updateTask }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.UPDATE_TASK, updateTask);
    });

    socket.on(
      PROJECT_CHANNEL.MOVE_TASK,
      ({ projectId, fromId, listId, toId }) => {
        socket
          .to(projectId)
          .emit(PROJECT_CHANNEL.MOVE_TASK, { fromId, listId, toId });
      }
    );

    socket.on(PROJECT_CHANNEL.DELETE_TASK, ({ projectId, taskId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.DELETE_TASK, taskId);
    });

    socket.on(PROJECT_CHANNEL.ADD_LIST, ({ projectId, newList }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.ADD_LIST, newList);
    });

    socket.on(PROJECT_CHANNEL.UPDATE_LIST, ({ projectId, updateTask }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.UPDATE_LIST, updateTask);
    });

    socket.on(PROJECT_CHANNEL.MOVE_LIST, ({ projectId, fromId, toId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.MOVE_LIST, { fromId, toId });
    });

    socket.on(PROJECT_CHANNEL.DELETE_LIST, ({ projectId, listId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.DELETE_LIST, listId);
    });
  });
}

module.exports = {
  initializeSocket,
  getIO: () => io,
};
