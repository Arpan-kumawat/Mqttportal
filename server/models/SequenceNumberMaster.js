var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var objSchema = new Schema({
    "last_number": { type: Number },
    "BusinessDate": { type: Date },
    "StoreCode": { type: String }, 
    "PosId":{ type: String }, 
    "updated_at": { type: Date ,default: Date.now}
}, { collection: 'SequenceNumberMaster' });
module.exports = mongoose.model('SequenceNumberMaster', objSchema);