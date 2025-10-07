var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "orgday" : { type: Number },
    "orgcen" : { type: Number },
    "orgcur" : { type: Number },
    "orgopc" : { type: String },
    "orgstr" : { type: Number },
    "orgcde" : { type: Number },
    "orgdsc" : { type: String },
    "orstdt" : { type: Number },
    "orendt" : { type: Number },
    "orcst" : { type: String },
    "orsts" : { type: String },
    "orctyp" : { type: String },
    "orlmus" : { type: Number },
    "orlmdt" : { type: Number },
    "orlmtm" : { type: String },
    "created_at": { type: Date }
}, { collection: 'pmr_orgpmf' });
module.exports = mongoose.model('pmr_orgpmf', itemSchema);