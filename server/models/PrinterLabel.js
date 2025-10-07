const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "printer_label_id" :{ type: String },
    "label_name" : { type: String },
    "items" : { type: Array },
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'printer_label',versionKey:false  });
module.exports = mongoose.model('printer_label', tableSchema);