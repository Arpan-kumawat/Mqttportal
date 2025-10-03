
const DeviceService = require('./DeviceService');

class DeviceController {
    constructor(){
        this._DeviceService= new DeviceService();
        this.data = this.data.bind(this);   
    }

       async data(req, res){
        try{
            const body = req.body || {};
            const { sensor } = body;
            if(!sensor){
                // respond with 400 Bad Request for missing required field
                return res.status(400).send({ status: false, message: "Please provide sensor id", data: null });
            }
            const data = await this._DeviceService.getData(body);
            return res.status(200).send({ status: true, message: "data found", data });
        }catch(err){
            console.log("Device Details Error : ", err);
            return res.status(500).send({ status: false, message: err, data: null });
        }
    }


}

module.exports = DeviceController