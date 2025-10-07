var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "type" : { type: String },
    "TerminalId": { type: String },
    "auth" : { type: Object },   
    "updated_at" : { type: Date }
}, { collection: 'SSWalletAuth' });
module.exports = mongoose.model('SSWalletAuth', itemSchema);