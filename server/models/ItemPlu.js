const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id": { type: String },
    "sku": { type: String },
    "plu": { type: Number },
    "original_plu": { type: Number },
    "created_at": { type: Date },
    "updated_at": { type: Date }
}, { collection: 'item_price', versionKey: false });

module.exports = mongoose.model('item_price', tableSchema);