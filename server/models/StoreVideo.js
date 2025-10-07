const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "video_link" : { type: String },
    "index" : { type: String },
    "created_at":{type:Date}
}, { collection: 'store_video',versionKey:false  });
module.exports = mongoose.model('store_video', tableSchema);




