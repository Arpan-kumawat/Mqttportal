const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema({
    "_v":false,   
    "pluday" : { type: String },
    "plucen" : { type: String },
    "plucur" : { type: String },  
    "pluupc" : { type: String },
    "plupcd" : { type: String },
    "pluevt" : { type: String },
    "pluprd" : { type: String },
    "plusdt" : { type: String },
    "pluedt" : { type: String },
    "pluprc" : { type: String },
    "plupyn" : { type: String },
    "mstbiz" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'plu' });
module.exports = mongoose.model('plu', tableSchema);