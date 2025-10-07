const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "_v":false,   
    "plusku" :{ type: String },
    "store" : { type: Array }
}, { collection: 'item_plu_ref' });
module.exports = mongoose.model('item_plu_ref', tableSchema);