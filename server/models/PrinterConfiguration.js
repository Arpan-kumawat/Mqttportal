const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" :{ type: String },
    "device_id" : { type: String },
    "printer_name": { type: String },
    "name": { type: String },
    "model": { type: String },
    "port": { type: String },
    "font" :{ type: String },
    "connection_type" :{ type: String },
    "role" : { type: String },
    "sip" : { type: String },
    "brand" : { type: String },
    "status":{ type: Boolean },
    "action":{ type: String },
    "is_double":{ type: Boolean },
    "printer_index":{ type: Number },
    "printer_label_id":{ type: String },
    "label_name":{ type: String },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'printer_configuration' , versionKey: false });

module.exports = mongoose.model('printer_configuration', itemSchema);
