const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({   
    "primary_group" : { type: String },
    "position" : { type: String },
    "group_member" : { type: String },
    "store_id" :{ type: String },
    "created_at" : { type: Date }
}, { collection: 'role_security_matrix', versionKey: false });
module.exports = mongoose.model('role_security_matrix', itemSchema);