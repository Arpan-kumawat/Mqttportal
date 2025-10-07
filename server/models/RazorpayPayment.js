var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var OrdersSchema = new Schema({ 
    "OrderNo": { type: String }, 
    "Type": { type: String },   
    "Details": { type: Object },    
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: Date.now }
}, { collection: 'RazorpayPayment', versionKey: false });
// make this available to our users in our Node applications
module.exports = mongoose.model('RazorpayPayment', OrdersSchema);