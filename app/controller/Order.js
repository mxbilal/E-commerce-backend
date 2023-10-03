const db = require("../models");
const moment = require("moment");

module.exports = {
  async create(req, res) {
    try {
      let payload = req?.body;
      const { id, name, description, price, order, category } = payload;
      let orderList = {
        productId: id,
        name,
        description,
        price,
        order,
        category,
      };
      let data = { ...payload, stock: parseInt(payload.stock) - payload.order };
      let addOrder = await db.order.create(orderList);
      await db.inventory.update(data, {
        where: {
          id: payload.id,
        },
      });

      if (addOrder?.dataValues) {
        console.log("added", addOrder?.dataValues);
        res.status(200).send({ success: true, message: "Ordered" });
      } else {
        console.log("something went wrong.");
        res
          .status(400)
          .send({ success: false, message: "Could not place order." });
      }
    } catch (err) {
      console.log("error", err);
      res
        .status(503)
        .send({ success: false, message: "Internal Server Error." });
    }
  },
  async get(req, res) {
    try {
      let order = await db.order.findAll();
      if (order?.length) res.status(200).send({ success: true, data: order });
      else
        res.status(200).send({
          success: false,
          message: "Data not found.",
          data: order,
        });
    } catch (err) {
      console.log("error", err);
      res
        .status(503)
        .send({ success: false, message: "Internal Server Error." });
    }
  },
  async calculateRevenue() {
    let list = await db.order.findAll();
    let orders = await db.order.findAll({
      attributes: [
        "name",
        [db.Sequelize.fn("SUM", db.sequelize.col("order")), "totalOrder"],
        [db.Sequelize.fn("SUM", db.sequelize.col("price")), "totalPrice"],
      ],
      group: ["name"],
    });
    const totalOrders = orders.reduce((acc, row) => {
      return acc + row.dataValues.totalOrder;
    }, 0);

    const totalRevenue = orders.reduce((acc, row) => {
      return acc + row.dataValues.totalPrice;
    }, 0);
    const sortedSales = orders.sort(
      (a, b) => b.dataValues.totalOrder - a.dataValues.totalOrder
    );
    return {
      totalRevenue,
      totalOrders,
      sortedSales,
      list,
    };
  },
};
