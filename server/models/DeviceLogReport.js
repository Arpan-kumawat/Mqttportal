var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "store_id" : { type: String },
    "device_id" : { type: String },
    "source" : { type: String },
    "details" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'device_log_report' , versionKey: false });

module.exports = mongoose.model('device_log_report', itemSchema);
