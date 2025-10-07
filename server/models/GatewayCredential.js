const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" :{ type: String },
    "device_id" : { type: String },
    "payment_brand":{ type: String },
    "terminal_model":{ type: String },
    "terminal_id":{ type: String },
    "ip_address":{ type: String },
    "merchant_id":{ type: String },
    "merchant_store_pos_code":{ type: String },
    "security_token":{ type: String },
    "location_id":{ type: String },
    "connection_type":{ type: String },
    "info":{ type: Object },
    "status":{ type: Boolean },
    "action":{ type: String },
    "type" : { type: String },
    "merchant_id" : { type: String },
    "merchant_key" : { type: String },
    "website_name" : { type: String },
    "host":{ type: String },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'gateway_credential' , versionKey: false });

module.exports = mongoose.model('gateway_credential', itemSchema);

