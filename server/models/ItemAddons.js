const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "addon_group_id" : { type: String },
    "addons_display_name" : { type: String },
    "addons_name" : { type: String },
    "selection_count" : { type: Number },
    "required" : { type: Boolean },
    "status" : { type: Boolean },
    "addons_list" : [ 
        { type: String },
    ],
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_addons',versionKey:false  });
module.exports = mongoose.model('item_addons', tableSchema);