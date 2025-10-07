var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "item_sku" : { type: String },
    "name" : { type: String },
    "description" : { type: String },
    "tier" : { type: String },
    "action" : { type: String }
}, { collection: 'tier_sku' });
module.exports = mongoose.model('tier_sku', itemSchema);