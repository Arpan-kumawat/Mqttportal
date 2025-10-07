const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "device_id" : { type: String },
    "emp_no" : { type: String },
    "session_status":{ type: String },
    "status" : { type: String },
    "float_amount" : { type: Number },
    "float_collection" : { type: Object },
    "tenders" : [{ type: Object }],
    "amount_collected" : { type: Number },
    "change_returned" : { type: Number },
    "business_date" : { type: Date },
    "out_business_date" : { type: Date },
    "in_date_time" : { type: Date },
    "out_date_time" : { type: Date },
    "created_at" : { type: Date },
    "store_status_id" : { type: ObjectId },
    "updated_at" : { type: Date }
}, { collection: 'cashier_collection', versionKey: false });
module.exports = mongoose.model('cashier_collection', itemSchema);