const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "tax_cat" : { type: String },
    "tax_dsc" : { type: String },
    "tax_fmt" : { type: Number },
    "tax_tmt" : { type: Number },
    "tax_type" : { type: String },    
    "tax_sdt" : { type: String },
    "tax_edt" : { type: String },
    "tax_pct" : { type: Number },
    "store_id" : { type: String },
    "created_at":{type:Date}
}, { collection: 'item_tcd', versionKey: false });
module.exports = mongoose.model('item_tcd', itemSchema);