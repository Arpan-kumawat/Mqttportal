const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "source_name" : { type: String },
    "sequence_no" : { type: Number },
    "source_code" : { type: String },
    "status" : { type: Boolean },
    "created_at":{type:Date}
}, { collection: 'order_source_list',versionKey:false  });
module.exports = mongoose.model('order_source_list', tableSchema);


