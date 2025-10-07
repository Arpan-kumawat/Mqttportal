var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
    "date_time" : { type: Date },
    "entry_check" : { type: Boolean },
    "interface" : { type: String },
    "to_be_inserted":{ type: Number },
    "duplicate":{ type: Number },
    "inserted" : { type: Number },
    "failed" : { type: Number },
    "source_zip_bucket" :  { type: String },
    "source_zip_key" : { type: String },
    "db_key" : { type: String },
    "db_collection" :  { type: String },
    "error" : { type: Array }
}, { collection: 'ExceptionReport' });
module.exports = mongoose.model('ExceptionReport', itemSchema);