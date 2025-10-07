const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "job_name": { type: String },
    "sod_time" :{ type: String },
    "eod_time" : { type: String },
    "timezone" : { type: String },
    "notify_email": { type: String },
    "notify_mobile_number" : {type: String },
    "status" : { type: Boolean },   
    "created_at":{type:Date}
}, { collection: 'bg_job_scheduler',versionKey:false  });
module.exports = mongoose.model('bg_job_scheduler', tableSchema);