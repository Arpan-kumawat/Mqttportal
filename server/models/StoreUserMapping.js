const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "emp_no" : { type: String },
    "store_id" : { type: String },
    "status" : { type: String }
}, { collection: 'store_user_mapping', versionKey: false });
module.exports = mongoose.model('store_user_mapping', itemSchema);