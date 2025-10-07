const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const schema = new Schema({
    "store_id" : { type: String },
    "start_date" : { type: Date },
    "end_date" : { type: Date },
    "created_at" : { type: Date },
    "status" : { type: Boolean }
}, {versionKey: false, collection: 'store_subscription_plan' });
module.exports = mongoose.model('store_subscription_plan', schema);