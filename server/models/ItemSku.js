const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({    
    "category_id" : { type: String },
    "sequence_no" :{ type: Number },
    "item_name" : { type: String },
    "description" : { type: String },
    "sku" : { type: String },
    "upc" : { type: String },
    "inventory_quantity" : { type: Number },
    "unit_of_measurement" : { type: String },
    "modifiers_group" : { type: Array },
    "addons" : { type: Array },
    "status" : { type: Boolean },
    "tag" :{ type: Array },
    "store_id" : { type: String },
    "item_img": { type: String },
    "created_at":{type:Date}
}, { collection: 'item_sku',versionKey:false  });
module.exports = mongoose.model('item_sku', itemSchema);