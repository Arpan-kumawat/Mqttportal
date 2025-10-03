const express = require('express');
const EmpController = require("./EmpController");

const router = express.Router();
const Emp = new EmpController();
router.post("/manage-cashier-collection", Emp.manageCashierCollection);
router.post("/save-printer-configuration", Emp.savePrinterConfiguration);
router.post("/save-gateway-credential", Emp.saveGatewayCredential);
router.post("/save-float-amount", Emp.saveFloatAmount);

router.use("/employee", router);
module.exports = router;