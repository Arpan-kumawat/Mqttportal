var express = require('express');
var router = express.Router();
const DeviceController = require("../services/device/DeviceController");

const Device = new DeviceController();
// router.get('/:order_id', Device.downloadInvoice);
// router.post('/socket', Device.SocketData);

module.exports = router;
