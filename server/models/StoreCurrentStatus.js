const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({    
    "store_id" : { type: String },    
    "status" : { type: String },
    "business_date": { type: Date },
    "opening_date": { type: Date },
    "closing_date": { type: Date }    
}, { collection: 'store_current_status', versionKey: false });
module.exports = mongoose.model('store_current_status', itemSchema);