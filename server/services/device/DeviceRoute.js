const express = require('express');
const DeviceController = require("./DeviceController");
const router = express.Router();

const Device = new DeviceController();


router.post("/data", Device.data);

module.exports = router;