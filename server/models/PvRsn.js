var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "rsctyp" : { type: String },
    "rscode" : { type: Number },
    "rscdsc" : { type: String }
}, { collection: 'pvrsn' });
module.exports = mongoose.model('pvrsn', itemSchema);