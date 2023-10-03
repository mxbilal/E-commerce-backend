const express = require("express"),
  app = express();
  const http = require("http"),
  server = http.createServer(app),
  { Server } = require("socket.io");

const { calculateRevenue } = require("./app/controller/Order");

const io = new Server(server, {
  cors: {
    origin: "https://ecommerce-dashboard-hrjg2oh3b-mxbilal.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("Client connected");

  const initialRevenue = await calculateRevenue();
  socket.emit("revenue", initialRevenue);
  socket.on("revenue", async (data) => {
    const initialRevenuee = await calculateRevenue();
    socket.broadcast.emit("revenue", initialRevenuee);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconne  cted");
  });
});
server.listen(4000, () => {
  console.log("listening on *:4000");
});