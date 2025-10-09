const express = require('express');
const DeviceController = require("./DeviceController");
const router = express.Router();

const Device = new DeviceController();


router.post("/data", Device.data);
router.post("/history-data", Device.GetHistoryData);

router.use("/Graphdata", router);



module.exports = router;