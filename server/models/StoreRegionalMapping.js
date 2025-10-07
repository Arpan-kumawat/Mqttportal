var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "region" : { type: String },
    "mapped_storeid" : { type: Number },
    "store_id" : { type: Array },
    "collectionModules" : { type: Array }
}, { collection: 'storeregional_mapping' });
module.exports = mongoose.model('storeregional_mapping', itemSchema);