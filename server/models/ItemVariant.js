const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "variant_name":{ type: String }, 
    "item_name" : { type: String },  
    "item_id" : { type: String },
    "sku" : { type: String },
    "mappin_id" : { type: String },  
    "item_addons" : [{ type: String }],
    "modifier_varaint" : [ 
        {
            "_id": false,
            "mg_id" : { type: String },
            "mv_id" :{ type: String }
        }
    ],
    "is_default": { type: Boolean },   
    "status": { type: Boolean },
    "alias_name" : {type : String},
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_variant', versionKey:false  });
module.exports = mongoose.model('item_variant', tableSchema);