const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "count" : { type: Number },
    "model" : { type: String }
}, { collection: 'identitycounters', versionKey: false });
module.exports = mongoose.model('identitycounters', itemSchema);