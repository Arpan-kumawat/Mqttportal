var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "type" : { type: String },
    "status" : { type: Boolean },
    "StoreCode" : { type: String },
    "err_msg" : { type: String },
    "BusinessDate" : { type: Date },
    "managerid" : { type: String },
    "reasonforoverride" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'manager_auth' });
module.exports = mongoose.model('manager_auth', itemSchema);