var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "CircleName": { type: String },
    "RegionName": { type: String },
    "DivisionName": { type: String },
    "OfficeName": { type: String },
    "Pincode": { type: Number },
    "OfficeType": { type: String },
    "Delivery": { type: String },
    "District": { type: String },
    "StateName": { type: String },
    "StateCode": { type: String }
}, { collection: 'po_list' });
module.exports = mongoose.model('po_list', itemSchema);