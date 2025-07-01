const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 8000;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint for Railway
app.get("/", (req, res) => {
  res.send("Socket server is running");
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
