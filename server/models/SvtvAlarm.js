const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const SvtvAlarm = new Schema({
     "sensor_id":{type:String},
    "vx": {type:Number},
    "vy":{type:Number},
    "vz": {type:Number},
    "gx": {type:Number},
    "gy": {type:Number},
    "gz": {type:Number},
    "selectedGatwat":{type:String},
    "temp_upper_bound": {type:Number},
    "temp_lower_bound": {type:Number},
    "trigger_group_id": {type:String},
    "status":{ type: Boolean },   
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'svtvalarm',versionKey:false });
module.exports = mongoose.model('svtvalarm', SvtvAlarm);