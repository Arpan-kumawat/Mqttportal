const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "primary_group" : { type: String },
    "position" : { type: String },
    "group_member" : { type: String },
    "action":{ type: String },
    "status":{ type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'role_position_mapping',versionKey:false });
module.exports = mongoose.model('role_position_mapping', itemSchema);