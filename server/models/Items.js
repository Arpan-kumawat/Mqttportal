const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({  
    "sku" : { type: String },  
    "category_id" : { type: String },
    "store_id" : { type: String },
    "item_addons" : [{ type: ObjectId }],
    "alias_desc" : { type: String },
    "alias_name" : { type: String },
    "description" : { type: String },
    "dietary" :   { type: String },
    "inventory_quantity" : { type: Number },
    "is_stock":{ type: Boolean },
    "item_img" : { type: String },
    "item_name" : { type: String },
    "item_combo_group_id" : { type: ObjectId },
    "sequence_no" : { type: Number },
    "status" : { type: Boolean },
    "tag" : { type: Array },
    "unit_of_measurement" : { type: String },   
    "is_taxable" : { type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'items',versionKey:false  });
module.exports = mongoose.model('items', itemSchema);
