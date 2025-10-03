const express = require('express');
const DeviceController = require("./DeviceController");
const router = express.Router();

const Device = new DeviceController();

// POST /data  -> will be mounted by the parent router at /device
router.post("/data", Device.data);

module.exports = router;