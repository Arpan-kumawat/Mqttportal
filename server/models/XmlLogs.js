var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "type" : { type: String },
    "xml_name" : { type: String },
    "storeid" : { type: String },
    "BusinessDate" : { type: Date },
    "created_at": { type: Date, default: Date.now }
}, { collection: 'XmlLog' });
module.exports = mongoose.model('XmlLog', itemSchema);