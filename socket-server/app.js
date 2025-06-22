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

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
