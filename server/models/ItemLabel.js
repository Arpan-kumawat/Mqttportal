const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "name" :  { type: String },
    "sequence_no":{ type: Number },
    "status":{type:Boolean},
    "label_id":{ type: String },
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_label',versionKey:false });
module.exports = mongoose.model('item_label', itemSchema);
