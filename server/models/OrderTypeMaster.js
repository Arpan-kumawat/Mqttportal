const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" :{ type: String },
    "order_code" : { type: String },
    "order_des" : { type: String },
    "order_type" : { type: String },
    "stdat" :{ type: Date },
    "stendat" : { type: Date },
    "action":{ type: String },
    "status":{ type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'store_order_type', versionKey:false });
module.exports = mongoose.model('store_order_type', itemSchema);