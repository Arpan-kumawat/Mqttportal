const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "offer_distribution_id" : { type: String },
    "store_id" : { type: String },
    "offer_id" : { type: String },
    "status" : { type: String },
    "entity" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'offer_distribution', versionKey: false });
module.exports = mongoose.model('offer_distribution', itemSchema);