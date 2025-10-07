var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "type" : { type: String },
    "managerid" : { type: String },
    "reason" : { type: String },
    "status" : { type: String },
    "storeid" : { type: String },
    "BusinessDate" : { type: Date },
    "created_at" : { type: Date }
}, { collection: 'audit_trail' });
module.exports = mongoose.model('audit_trail', itemSchema);