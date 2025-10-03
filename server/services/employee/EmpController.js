const _ = require("lodash");
const EmpService = require("./EmpService");


class EmpController {
  constructor() {
    this._EmpService = new EmpService();
    this.empList = this.empList.bind(this);
    this.saveEmp = this.saveEmp.bind(this);
  }

  async empList(req, res) {
    try {
      const body = req.body;
      if (!body.store_id) {
        throw "Please provide required value";
      }
      const data = await this._EmpService.empList(body);
      return res
        .status(200)
        .send({ status: true, message: "data found", data });
    } catch (err) {
      console.log("Emp List Error : ", err);
      return res.status(500).send({ status: false, message: err, data: null });
    }
  }

  async saveEmp(req, res) {
    try {
      const body = req.body;
      const { store_id } = body;
      if (!store_id) {
        throw "Please provide required details";
      }
      const result = await this._EmpService.saveEmp(body);
      return res
        .status(200)
        .send({ status: true, message: "Saved", data: result });
    } catch (err) {
      console.log("Save Emp Error : ", err);
      return res.status(500).send({ status: false, message: err, data: null });
    }
  }

}

module.exports = EmpController;