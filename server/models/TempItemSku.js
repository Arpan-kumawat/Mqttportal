var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "key" : { type: String },
    "upcday" : { type: Number },
    "upccen" : { type: Number },
    "upccur" : { type: Number },
    "upcopc" : { type: String },
    "storeid" : { type: Number },
    "upccde" : { type: String },
    "upcsku" : { type: String },
    "upcccd" : { type: Number },
    "upcumr" : { type: String },
    "upcbiz" : { type: String },
    "created_at" : { type: Date },
    "sku" : { type: Object },
    "plu" : { type: Array },
    "tmc" : { type: Array },
    "tcd" : { type: Array },
    "OfferTerm" : { type: Array }
}, { collection: 'TempItemSku' });
module.exports = mongoose.model('TempItemSku', itemSchema);