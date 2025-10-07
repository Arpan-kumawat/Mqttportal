var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "rsnday" : { type: Number },
    "rsncen" : { type: Number },
    "rsncur" : { type: Number },
    "rsnopc" : { type: String },
    "storeid" : { type: Number },
    "rsctyp" : { type: String },
    "rscode" : { type: Number },
    "rscdsc" : { type: String },
    "rscpri" : { type: Number },
    "rscsrt" : { type: Number },
    "rscviz" : { type: String },
    "crtdat" : { type: Number },
    "todat" : { type: Number },
    "created_at" : { type: Date }
}, { collection: 'osdirsn' });
module.exports = mongoose.model('osdirsn', itemSchema);