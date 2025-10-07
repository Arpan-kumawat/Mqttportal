// const { boolean } = require('joi');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var signageSigma = new Schema({
    "name": { type: String },
    "banner_urls": { type: Object },
    "digital_signage_id": { type: String },
    "category_details": { type: Object },
    "store_id": { type: String },
    "layout_selected": { type: String },
    "status": { type: Boolean },
    "created_at": { type: Date },
    "updated_at": { type: Date },
}, { collection: 'digital_signage', versionKey: false });
module.exports = mongoose.model('AcquirerTenderList', signageSigma);