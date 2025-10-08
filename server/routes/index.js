const express = require('express');
const router = express.Router();

const routes = [
    require("../services/device/DeviceRoute"),
    require("../services/auth/AuthRoute"),
    require("../services/employee/EmpRoute"),
  
]

router.use("/", routes);

module.exports = router;

