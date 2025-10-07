const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const paymentsSchema = new Schema({
    "last_invoice": { type: Number },
    "store_id": { type: String },
    "workstation_id":{ type: String },
    "financial_end_date":{ type: Date},
    "updated_at": { type: Date ,default: Date.now}
}, { collection: 'store_invoice_bos_number' });
module.exports = mongoose.model('store_invoice_bos_number', paymentsSchema);