const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "device_id" : { type: String },
    "health_status" : { type: Object },
    "status":{ type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date },
    "source" : {type:String},
}, { collection: 'device_health',versionKey:false });
module.exports = mongoose.model('device_health', itemSchema);