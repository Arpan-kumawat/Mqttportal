const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const AlarmTigger = new Schema({
     "sensor_id":{type:String},
    "values": {type:Object},
    "limits":{type:Object},
    "triggeredAt": {type:String},
}, { collection: 'alarmTigger',versionKey:false });
module.exports = mongoose.model('alarmTigger', AlarmTigger);