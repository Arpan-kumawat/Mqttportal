var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "upcday" : { type: String },
    "upccen" : { type: String },
    "upccur" : { type: String },
    "upcopc" : { type: String },
    "storeid" : { type: String },
    "upccde" : { type: String },
    "upcsku" : { type: String },
    "upcccd" : { type: String },
    "upcumr" : { type: String },
    "upcbiz" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'item_upc' });
module.exports = mongoose.model('item_upc', itemSchema);