const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "sku" : { type: String },
    "store_id" : { type: String },
    "tax_cat" : { type: String },
    "tax_opc" :{ type: String },
    "created_at":{type:Date}
}, { collection: 'item_tmc', versionKey: false });
module.exports = mongoose.model('item_tmc', itemSchema);