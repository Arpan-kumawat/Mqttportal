const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "cust_mobile" : { type: String },
    "store_id" : { type: String },
    "cust_password" : { type: String },
    "cust_address" :  { type: Object },
    "cust_city" : { type: String },
    "cust_state" : { type: String },
    "cust_country" : { type: String },
    "cust_loyality_points" : { type: Number },
    "cust_zipcode" : { type: String },
    "cust_discount" : { type: String },
    "cust_DOB" : { type: String },
    "cust_email_id":{type: String},
    "cust_first_name":{type: String},
    "cust_last_name":{type: String},
    "cust_loyalty_point" :{type: String},
    "cust_ledeem_loyalty_point":{type: String},
    "action":{ type: String }, 
    "status":{ type: Boolean },
    "tax_id":{ type: String },
    "cust_company" : { type: String },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'customer',versionKey:false });
module.exports = mongoose.model('customer', itemSchema);



