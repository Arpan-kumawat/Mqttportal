const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "offer_id" :  { type: String },
    "offer_term_id" :  { type: String },
    "type_code" :  { type: String },
    "mandatory_indicator" :  { type: Boolean },
    "no_pertrans" :  { type: String },
    "offering_type" :  { type: String },
    "product_type" :  { type: String },
    "offering_typecode" :  { type: String },
    "condition_type" :  { type: String },
    "count" :  { type: Number },
    "amount" : { type: Number },
    "quan_enforce" : { type: Boolean },
    "subsdiscavailable" : { type: Boolean },
    "reward_type" : { type: String },
    "discount_type_code" : { type: String },
    "discount_type_value" : { type: String },
    "meid_typecode" : { type: String },
    "meid_value" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'offer_term' , versionKey: false });
module.exports = mongoose.model('offer_term', itemSchema);