const express = require("express"),
  app = express();
  const http = require("http"),
  server = http.createServer(app),
  { Server } = require("socket.io");

const { calculateRevenue } = require("./app/controller/Order");

const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin:["http://localhost:5173","https://ecommerce-dashboard-hrjg2oh3b-mxbilal.vercel.app/inventory"],
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


const db = require("./app/models");
db.sequelize
  .sync({ alter: true })
  .then(() => {
    server.listen(process.env.SOCKET_PORT, () => {
      console.log("listening on",process.env.SOCKET_PORT);
    });
  })
  .catch((err) => {
    console.log("err", err);
  });
