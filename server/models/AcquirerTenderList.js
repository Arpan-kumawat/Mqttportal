var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "sdiday" : { type: String },
    "sdicen" : { type: String },
    "sdicur" : { type: String },
    "action" : { type: String },
    "storeid" : { type: String },
    "sdicod" : { type: String },
    "sdides" : { type: String },
    "reprin" : { type: String },
    "bnkcod" : { type: String },
    "tndplu" : { type: String },
    "tndtyp" : { type: String },
    "tndidg" : { type: String },
    "tndbiz" : { type: String },
    "stdat" : { type: String },
    "stendat" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'AcquirerTenderList' });
module.exports = mongoose.model('AcquirerTenderList', itemSchema);