var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "ormday" : { type: Number },
    "ormcen" : { type: Number },
    "ormcur" : { type: Number },
    "ormopc" : { type: String },
    "orgcde" : { type: Number },
    "ormstr" : { type: Number },
    "ormbrn" : { type: Number },
    "created_at": { type: Date }
}, { collection: 'pmr_orcgmf' });
module.exports = mongoose.model('pmr_orcgmf', itemSchema);