const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "mv_id": { type: String },
    "mg_id" : { type: String },
    "modifier_name" : { type: String },   
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_modifier',versionKey:false  });
module.exports = mongoose.model('item_modifier', itemSchema);