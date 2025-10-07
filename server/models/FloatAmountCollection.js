const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },   
    "emp_no" : { type: String },
    "type" : { type: String },
    "emp_session_id":{ type: ObjectId },
    "store_session_id" : { type: ObjectId },
    "float_amount" : { type: Number },  
    "business_date" : { type: Date },   
    "created_at" : { type: Date }
}, { collection: 'float_amount_collection', versionKey: false });
module.exports = mongoose.model('float_amount_collection', itemSchema);