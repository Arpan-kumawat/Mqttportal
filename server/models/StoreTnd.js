const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "store_id" : { type: String },
    "tnd_code" : { type: String },
    "tnd_des" : { type: String },
    "tnd_type" : { type: String },
    "additional_charge" : { type: Object },
    "stdat" : { type: Date },
    "stendat" :  { type: Date },
    "action":{ type: String },
    "status":{ type: Boolean },
    "created_at" : { type: Date },
    "updated_at": { type: Date },
    "source" : {type:String},
}, { collection: 'store_tnd',versionKey:false });
module.exports = mongoose.model('store_tnd', itemSchema);