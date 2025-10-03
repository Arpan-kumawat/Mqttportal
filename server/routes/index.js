const express = require('express');
const router = express.Router();

// Mount service routers explicitly
const deviceRoute = require("../services/device/DeviceRoute");
// const authRoute = require("../services/auth/AuthRoute");
// const storeRoute = require("../services/store/StoreRoute");

// Mount device routes at /device
router.use('/device', deviceRoute);

module.exports = router;
