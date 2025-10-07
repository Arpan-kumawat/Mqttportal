const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "store_id" : { type: String },
    "display" : { type: String },
    "is_sound_notification" : { type: Boolean },
    "order_view_language" : { type: String },
    "printer_setting" : { type: Object },
    "yellow_color_time" : { type: String },
    "red_color_time" : { type: String },
    "device_id" : { type: String },
    "previous_order_list_time" : { type: Number },
    "action": { type: String },
    "created_at":{type:Date},
    "font_size" : {type : String},
}, { collection: 'kds_settings',versionKey:false  });
module.exports = mongoose.model('kds_settings', tableSchema);



