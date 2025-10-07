const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const paymentsSchema = new Schema({
    "order_id": { type: String },
    "system_order_no": { type: String },
    "order_status_response": { type: Object },    
    "created_at": { type: Date ,default: Date.now},
    "updated_at": { type: Date ,default: Date.now}
}, { collection: 'paytm_order_status_response' });
module.exports = mongoose.model('paytm_order_status_response', paymentsSchema);