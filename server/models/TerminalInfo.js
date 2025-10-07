const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "terminal_id" : { type: Number },
    "store_id" : { type: String },
    "device_id" : { type: String },
    "source": { type: String },
    "created_at" : { type: Date },
    "pilot":{ type: Boolean },
    "status":{ type: Boolean }
}, { collection: 'terminal_info', versionKey:false });
module.exports = mongoose.model('terminal_info', itemSchema);