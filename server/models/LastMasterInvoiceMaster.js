const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const paymentsSchema = new Schema({
    "last_invoice": { type: Number },
    "business_date": { type: Date },
    "store_id": { type: String }, 
    "pos_id":{ type: String }, 
    "updated_at": { type: Date ,default: Date.now}
}, { collection: 'last_master_invoice_master' });
module.exports = mongoose.model('last_master_invoice_master', paymentsSchema);