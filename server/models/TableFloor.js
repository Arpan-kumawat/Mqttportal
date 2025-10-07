const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({  
    "floor_name" : { type: String },
    "floor_no" : { type: String },  
    "store_id" : { type: String },
    "floor_img" : { type: String },
    "sequence_no" : { type: Number },
    "table_list": { type: Object },
    "status" : { type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'table_floor',versionKey:false  });
module.exports = mongoose.model('table_floor', itemSchema);