const express = require("express"),
  cors = require("cors"),
  app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { calculateRevenue } = require("./app/controller/Order");
const db = require("./app/models");
const inventoryRoutes = require("./app/routes/inventory");
const orderRoutes = require("./app/routes/order");

app.use("/inventory", inventoryRoutes);
app.use("/order", orderRoutes);
app.get("/api/test", (req, res) => {
  res.send("Server is Up!");
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
    console.log("Client disconnected");
  });
});

db.sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(process.env.PORT || 3000);
    server.listen(4000, () => {
      console.log("listening on *:4000");
    });
    //pending set timezone
    console.log("App listening on port " + process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log("err", err);
  });
