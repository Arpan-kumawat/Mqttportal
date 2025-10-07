const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "combo_group_id": { type: String },
    "combo_group":[
        {
            "_id": false,
            "combo_group_name": { type: String },
            "combo_display_name": { type: String },
            "selection_count": { type: Number },
            "required": { type: Boolean },
            "combo_group_list": [
                {
                    "_id": false,
                    "main_item_id": { type: String },
                    "item_id" : { type: String },
                    "item_name": { type: String },
                    "is_default" : { type: Boolean },                    
                    "additional_price" :{ type: Number },
                }
            ]
        }
    ],
    "status": { type: Boolean },
    "created_at":{type:Date},
    "updated_at":{type:Date}
}, { collection: 'item_combo_group', versionKey:false  });
module.exports = mongoose.model('item_combo_group', tableSchema);