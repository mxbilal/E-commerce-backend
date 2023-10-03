const express = require("express"),
  cors = require("cors"),
  app = express();

const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./app/models");
const inventoryRoutes = require("./app/routes/inventory");
const orderRoutes = require("./app/routes/order");

app.use("/inventory", inventoryRoutes);
app.use("/order", orderRoutes);
app.get("/api/test", (req, res) => {
  res.send("Server is Up!");
});


db.sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(process.env.PORT || 3000);
    
    //pending set timezone
    console.log("App listening on port " + process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log("err", err);
  });
