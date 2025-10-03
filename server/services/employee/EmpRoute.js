const express = require("express");
const EmpConroller = require("./EmpController");
const router = express.Router();

const Emp = new EmpConroller();

router.post("/list",  Emp.empList);
router.post("/save", Emp.saveEmp);

router.use("/employee", router);
module.exports = router;