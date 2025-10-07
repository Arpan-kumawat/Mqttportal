const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({  
    "floor_id" : { type: ObjectId },
    "store_id" : { type: String },
    "table_seating_capacity" : { type: String },
    "table_no" : { type: String },
    "table_shape" : { type: String },
    "table_position" : { type: String },
    "table_coordinate_x" : { type: String },
    "table_coordinate_y" : { type: String },
    "table_status" : { type: String },
     "status" : { type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'table_master',versionKey:false  });
module.exports = mongoose.model('table_master', itemSchema);


