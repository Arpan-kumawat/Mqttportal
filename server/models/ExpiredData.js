var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
    "collection_name" : { type: String },
    "expired_id" : { type: ObjectId },
    "created_at" : { type: Date }
}, { collection: 'ExpiredData' });

module.exports = mongoose.model('ExpiredData', itemSchema);