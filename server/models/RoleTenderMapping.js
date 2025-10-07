var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "primary_group" : { type: String },
    "tender" : { type: Object }
}, { collection: 'roletender_mapping' });
module.exports = mongoose.model('roletender_mapping', itemSchema);