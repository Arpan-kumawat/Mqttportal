const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "banner_link" : { type: String },
    "category_id" : { type: String },
    "label_id" : { type: String },
    "sku" : { type: String },
    "created_at":{type:Date}
}, { collection: 'banner_details',versionKey:false  });
module.exports = mongoose.model('banner_details', tableSchema);

