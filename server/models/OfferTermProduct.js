const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "offer_id" :{ type: String },
    "offer_term_product_id" : { type: String },
    "offer_term_id" : { type: String },
    "category_id" : { type: String },
    "item_id" : { type: String },
    "inex_flag" : { type: String },
    "disc_type_code" : { type: String },
    "disc_value" : { type: String },
    "display_qty" : { type: String },
    "product_type" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'offer_term_product' , versionKey: false });
module.exports = mongoose.model('offer_term_product', itemSchema);