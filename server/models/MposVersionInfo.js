var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "active" : { type: Boolean },
    "version" : { type: String },
    "info" : { type: String },
    "instruction" : { type: String }
}, { collection: 'MposVersionInfo' });
module.exports = mongoose.model('MposVersionInfo', itemSchema);

