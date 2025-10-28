const DeviceService = require("./DeviceService");

class DeviceController {
  constructor() {
    this._DeviceService = new DeviceService();
    this.data = this.data.bind(this);
    this.GetHistoryData = this.GetHistoryData.bind(this);
    this.SvtvAlarm = this.SvtvAlarm.bind(this);
  }

  async data(req, res) {
    try {
      const body = req.body || {};
      const { sensor } = body;
      if (!sensor) {
        // respond with 400 Bad Request for missing required field
        return res.status(400).send({
          status: false,
          message: "Please provide sensor id",
          data: null,
        });
      }
      const data = await this._DeviceService.GetData(body);
      return res
        .status(200)
        .send({ status: true, message: "data found", data });
    } catch (err) {
      console.log("Device Details Error : ", err);
      return res.status(500).send({ status: false, message: err, data: null });
    }
  }

  async GetHistoryData(req, res) {
    try {
      const body = req.body || {};
      const { from, to,gateway } = body;
      if (!from || !to || !gateway) {
        // respond with 400 Bad Request for missing required field
        return res
          .status(400)
          .send({ status: false, message: "Please provide data", data: null });
      }
      const data = await this._DeviceService.GetHistoryData(body);
      return res
        .status(200)
        .send({ status: true, message: "data found", data });
    } catch (err) {
      console.log("Device Details Error : ", err);
      return res.status(500).send({ status: false, message: err, data: null });
    }
  }

  async SvtvAlarm(req, res) {
    try {
      const body = req.body || {};
      const { sensor_id } = body;
      if (!sensor_id) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide sensor id",
            data: null,
          });
      }
      const data = await this._DeviceService.SvtvAlarm(body);
      return res
        .status(200)
        .send({ status: true, message: "data found", data });
    } catch (err) {
      console.log("Device Details Error : ", err);
      return res.status(500).send({ status: false, message: err, data: null });
    }
  }
}

module.exports = DeviceController;
