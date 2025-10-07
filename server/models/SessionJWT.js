const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const customerSchema = new Schema({
    "emp_no" : { type: String },
    "jwt" : { type: String },   
    "created_at": { type: Date, default: Date.now },
}, {collection: 'session_jwt', versionKey:false});
module.exports = mongoose.model('session_jwt', customerSchema);
