const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "offer_id" : { type: String },
    "offer_header_id" : { type: String },
    "description" : { type: String },
    "effective_date" : { type: Date },
    "end_date" : { type: Date },
    "term_style" : { type: String },
    "deal_dist" : { type: String },
    "anniversary" : { type: String },
    "birthday" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'offer_header', versionKey: false });
module.exports = mongoose.model('offer_header', itemSchema);