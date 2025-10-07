const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "mg_id": { type: String },
    "modifier_display_name" :{ type: String },
    "modifiers_group" : { type: String },   
    "alias_display_name" : { type: String },
    "status" : { type: Boolean },
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_modifier_group',versionKey:false  });
module.exports = mongoose.model('item_modifier_group', tableSchema);