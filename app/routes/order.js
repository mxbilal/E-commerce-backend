const express = require("express");
const router = express.Router();
const order = require("../controller/Order");

router.get("/list", order.get);
router.post("/add", order.create);

module.exports = router;
