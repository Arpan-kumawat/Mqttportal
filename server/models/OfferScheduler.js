const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "offer_id" : { type: String },
    "offer_scheduler_id" : { type: String },
    "is_all_days" :{ type: Boolean },
    "days" : [
        {
            "day" : { type: String },
            "time_frame" : [ 
                {
                    "start_time" : { type: String },
                    "end_time" : { type: String }
                },
            ]
        }
    ],
    "created_at": { type: Date }
}, { collection: 'offer_scheduler', versionKey: false });
module.exports = mongoose.model('offer_scheduler', itemSchema);