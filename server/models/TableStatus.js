const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({  
    "table_id" : { type: ObjectId },
    "store_id" : { type: String },
    "table_status" : { type: String },
    "order_no" : { type: String },
    "created_at" : { type: Date },
    "updated_at": { type: Date }
}, { collection: 'table_status',versionKey:false  });
module.exports = mongoose.model('table_status', itemSchema);


