const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "password" : { type: String },
    "store_id" : { type: String },
    "emp_no" : { type: String },
    "emp_name" : { type: String },
    "emp_fnm" : { type: String },
    "emp_lnm" : { type: String },
    "emp_mobile_no":{type: String},
    "emp_email_id":{type: String},
    "emp_fn" : { type: String },
    "position" : { type: String },
    "emp_doj" : { type: Date },
    "password_last_updated" : { type: Date },
    "password_expiry" : { type: Date },
    "action":{ type: String }, 
    "status":{ type: Boolean },   
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'orempf',versionKey:false });
module.exports = mongoose.model('orempf', itemSchema);