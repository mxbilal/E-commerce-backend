const express = require("express");
const router = express.Router();
const inventory = require("../controller/Inventory");

router.get("/list", inventory.get);
router.post("/add", inventory.create);
router.put("/update", inventory.update);
router.delete("/delete", inventory.delete);

module.exports = router;
