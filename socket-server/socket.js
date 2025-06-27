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
      console.log(id, " connected as:", socket.id);
      connectedUsers.set(id, socket.id);
    });

    socket.on(PROJECT_CHANNEL.JOIN_ROOM, (projectId) => {
      console.log(`${socket.id} joined room:${projectId}`);
      socket.join(projectId);
    });

    socket.on(PROJECT_CHANNEL.LEAVE_ROOM, (projectId) => {
      console.log(`${socket.id} left room:${projectId}`);

      socket.leave(projectId);
    });

    socket.on(PROJECT_CHANNEL.ASSIGN_ADMIN, ({ projectId, adminId }) => {
      console.log(
        `Assigning ${adminId} to be the new admin of project ${projectId}`
      );

      socket.to(projectId).emit(PROJECT_CHANNEL.ASSIGN_ADMIN, adminId);
    });

    socket.on(
      PROJECT_CHANNEL.UPDATE_PROJECT_INFO,
      ({ projectId, name, description, state, theme }) => {
        socket.to(projectId).emit(PROJECT_CHANNEL.UPDATE_PROJECT_INFO, {
          name,
          description,
          state,
          theme,
        });
      }
    );

    socket.on(
      PROJECT_CHANNEL.ADD_MEMBER,
      ({ projectId, projectName, userId, email, createdAt, _id }) => {
        console.log(`Inviting ${userId?.toString()} to project: ${projectId}`);
        io.to(connectedUsers.get(userId)).emit(PROJECT_CHANNEL.ADD_MEMBER, {
          _id,
          projectId,
          projectName,
          email,
          createdAt,
        });
      }
    );

    socket.on(PROJECT_CHANNEL.JOIN_PROJECT, ({ projectId, user }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.JOIN_PROJECT, user);
    });

    socket.on(PROJECT_CHANNEL.LEAVE_PROJECT, ({ projectId, userId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.LEAVE_PROJECT, userId);
    });

    socket.on(PROJECT_CHANNEL.DELETE_PROJECT, ({ projectId }) => {
      console.log(`Deleting ${projectId}`);
      socket.to(projectId).emit(PROJECT_CHANNEL.DELETE_PROJECT);
    });

    socket.on(PROJECT_CHANNEL.ADD_TASK, ({ projectId, listId, newTask }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.ADD_TASK, { listId, newTask });
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

    socket.on(PROJECT_CHANNEL.UPDATE_LIST, ({ projectId, listId, name }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.UPDATE_LIST, { listId, name });
    });

    socket.on(PROJECT_CHANNEL.MOVE_LIST, ({ projectId, fromId, toId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.MOVE_LIST, { fromId, toId });
    });

    socket.on(PROJECT_CHANNEL.DELETE_LIST, ({ projectId, listId }) => {
      socket.to(projectId).emit(PROJECT_CHANNEL.DELETE_LIST, listId);
    });

    socket.on(PROJECT_CHANNEL.LOG, ({ projectId, log }) => {
      io.to(projectId).emit(PROJECT_CHANNEL.LOG, log);
    });
  });
}

module.exports = {
  initializeSocket,
  getIO: () => io,
};
