var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "store_id" : { type: String },
    "associated" : { type: Array }
}, { collection: 'associated_store' });
module.exports = mongoose.model('associated_store', itemSchema);