var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "business_unit" : { type: String },
    "master_store" : { type: Number },
    "store_id" : { type: Array }
}, { collection: 'pmr_businessunit_mapping' });
module.exports = mongoose.model('pmr_businessunit_mapping', itemSchema);