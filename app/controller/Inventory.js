const db = require("../models");
module.exports = {
  async create(req, res) {
    try {
      let payload = req?.body;
      let addInventory = await db.inventory.create(payload);
      if (addInventory?.dataValues) {
        console.log("added", addInventory?.dataValues);

        res.status(200).send({ success: true, message: "Product Added." });
      } else {
        console.log("something went wrong.");
        res
          .status(400)
          .send({ success: false, message: "Could not Add Product." });
      }
    } catch (err) {
      console.log("error", err);
      res
        .status(503)
        .send({ success: false, message: "Internal Server Error." });
    }
  },
  async update(req, res) {
    try {
      let payload = req?.body;
      console.log("upd", payload);
      let updateInventory = await db.inventory.update(payload, {
        where: {
          id: payload.id,
        },
      });
      if (updateInventory[0] > 0) {
        console.log("updateInventory", updateInventory);

        res.status(200).send({ success: true, message: "Product Updated." });
      } else {
        console.log("something went wrong.");
        res
          .status(400)
          .send({ success: false, message: "Could not Update Product." });
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
      let inventory = await db.inventory.findAll({
        where: {
          isDeleted: false,
        },
      });
      if (inventory?.length)
        res.status(200).send({ success: true, data: inventory });
      else
        res.status(200).send({
          success: false,
          message: "Data not found.",
          data: inventory,
        });
    } catch (err) {
      console.log("error", err);
      res
        .status(503)
        .send({ success: false, message: "Internal Server Error." });
    }
  },
  async delete(req, res) {
    try {
      let { id } = req?.query;
      let deleteInventory = await db.inventory.update(
        { isDeleted: true },
        {
          where: {
            id,
          },
        }
      );
      if (deleteInventory[0] > 0) {
        console.log("deleteInventory", deleteInventory);

        res.status(200).send({ success: true, message: "Product Deleted." });
      } else {
        console.log("something went wrong.");
        res
          .status(200)
          .send({ success: false, message: "Could not delete Product." });
      }
    } catch (err) {
      console.log("error", err);
      res
        .status(503)
        .send({ success: false, message: "Internal Server Error." });
    }
  },
};
